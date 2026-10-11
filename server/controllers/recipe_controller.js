const supabase = require('./../config/supabaseClient');
const recipes = require('./../models/recipe_model');
const {Msg} = require('./../utils/helperFunc');
const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");
const likes = require("../models/like_model");

const createRecipe = async (req, res, next) =>{
    const {
        recipe_name, author, category, difficulty, serving,
        ingredients, instructions, prepTime, cookingTime,
        image
    } = req.body;
    try{
        if(!recipe_name || !category || !ingredients || !instructions){
            next(new Error('recipe_name,category,ingredients & instructions must be filled!'));
            return;
        }
        if(prepTime<=0 || cookingTime<=0 || serving<=0){
            next(new Error('Preparation time, Cooking time & Serving must be greater than 0!'));
            return;
        }
        if(!Array.isArray(ingredients) || ingredients.length === 1){
            return next(new Error('At least, Two ingredients must be included!'));
        }
        if(!Array.isArray(instructions) || instructions.length === 0){
            return next(new Error('One Step of Instructions must be included!'));
        }

        await new recipes({
            recipe_name, author, category,
            difficulty, serving,
            ingredients, instructions,
            prepTime, cookingTime,
            image
        }).save();
        Msg(res, 'Recipe Created Successfully!');
    }catch(err){
        console.log(err);
        next(new Error('Error creating recipe'));
    }
}
const getAll = async (req, res, next) => {
    try {
        const allRecipes = await recipes.aggregate([
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'recipe_id',
                    as: 'recipeComments'
                }
            },
            {
                $addFields: {commentsCount: { $size: '$recipeComments' }}
            },
            {$project: { recipeComments: 0 }}
        ]);
        Msg(res, 'All Recipes', allRecipes);
    } catch (err) {
        console.log(err);
        next(new Error('Error getting all recipes.'));
    }
};
const basedOnType = async (req, res, next) => {
    try {
        const type = req.params.type;
        const matchQuery = type.toLowerCase() === 'all' ? {} : { category: { $regex: new RegExp(`^${type}$`, 'i') } };

        const recipes_list = await recipes.aggregate([
            { $match: matchQuery },
            {
                // join with comments collection and find same recipe_id
                $lookup: {
                    from: 'comments',
                    localField: '_id',// primary key
                    foreignField: 'recipe_id', // foreign key from comments
                    as: 'recipeComments'
                }
            },
            {
                $addFields: {
                    commentsCount: { $size: '$recipeComments' }
                }
            },
            {
                $project: { recipeComments: 0 }
            }
        ]);

        Msg(res, "Recipes that are matched with your type!", recipes_list);
    } catch (err) {
        console.log(err);
        next(new Error('Error getting basedOnType!'));
    }
}
const getMyRecipes = async(req,res,next) => {
    try{
        const { id } = req.params;
        const myRecipes = await recipes.aggregate([
            {$match: {"author.id": id}},
            {
                $lookup: {from: 'comments',
                localField: '_id', foreignField: 'recipe_id',
                as: 'recipeComments'}
            },
            {
                $addFields: {commentsCount: {$size: '$recipeComments'}}
            },
            {$project: {recipeComments: 0}}
        ]);
        if(!myRecipes || myRecipes.length===0){
            return Msg(res, "You haven't created any recipes yet!",[]);
        }
        Msg(res, 'Your Recipes List!', myRecipes);
    }catch(err){
        console.log('error getting yours Recipes from db.',err);
        next(new Error('Error getting yours Recipes from db.'));
    }
}
const getRecipeDetails = async (req, res, next) => {
    try {
        const recipeDetail = await recipes.findById(req.params._id);
        //console.log('detail: ',recipeDetail);
        if (!recipeDetail) {
            next(new Error("Recipe not found!"));
        }
        const recipeData = recipeDetail.toObject();
        Msg(res, "Recipe Detail Fetched!", recipeData);
    } catch (err) {
        console.log(err);
        next(new Error('Error getting recipe detail!'));
    }
};
const editRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const updateData = req.body;

        const updatedRecipe = await recipes.findByIdAndUpdate(
            recipeId,
            updateData,
            { returnDocument: 'after', runValidators: true },
        );

        if (!updatedRecipe) {
            console.log("Recipe not found for ID:", recipeId);
            next(new Error('Recipe not found for ID'));
        }
        Msg(res,'Recipe Updated Successfully!', updatedRecipe);
    } catch (err) {
        console.log('Error updating recipe: ', err);
        next(new Error('Error updating recipe!'));
    }
};
const deleteRecipe = async(req, res, next) =>{
    try{
        const recipeId = req.params.id;
        const recipe = await recipes.findById(recipeId);
        if (!recipe) {
            return next(new Error('Recipe not found!'));
        }
        if(recipe.image){
            const filePath = recipe.image.includes('/store_recipes/')
                ? recipe.image.split('/store_recipes/')[1]
                : recipe.image;

            const { error: storageError } = await supabase.storage
                .from('store_recipes')
                .remove([filePath]);

            if (storageError) {
                console.error("Supabase Storage Error:", storageError);
            }
        }
        const deletedRecipe = await recipes.deleteOne({_id: recipeId});
        if(!deletedRecipe){
            return next(new Error('Recipe not found!'));
        }
        Msg(res, 'Recipe Deleted Successfully!', deletedRecipe);
    }catch(err){
        console.log(err);
        next(new Error('Error deleting recipe'));
    }
}
const searchWithAnything = async (req, res, next) => {
    try {
        const queryTerm = req.query.q || req.query.search || '';

        // Check if query term is provided
        if (!queryTerm.trim()) {
            return Msg(res, "Query term is empty, returned empty list.", []);
        }

        // Create a case-insensitive regex for searching
        const searchRegex = new RegExp(queryTerm.trim(), 'i');

        // Target both recipe_name and category using $or
        const matchQuery = {
            $or: [
                { recipe_name: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        };

        const searchResults = await recipes.aggregate([
            { $match: matchQuery },
            {
                // Join with comments collection to get comment count
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'recipe_id',
                    as: 'recipeComments'
                }
            },
            {
                $addFields: {
                    commentsCount: { $size: '$recipeComments' }
                }
            },
            {
                $project: { recipeComments: 0 }
            }
        ]);

        Msg(res, "Search results fetched successfully!", searchResults);
    } catch (err) {
        console.log('Error searching recipes:', err);
        next(new Error('Error searching recipes!'));
    }
};
const getLovedRecipes = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return next(new Error('User authentication required!'));
        }
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
        const userStringId = userId.toString();
        const lovedRecipes = await likes.aggregate([
            {
                // Match reactor_id as either ObjectId or String
                $match: {
                    $or: [
                        { reactor_id: userObjectId },
                        { reactor_id: userStringId },
                        { user_id: userObjectId },
                        { user_id: userStringId }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'recipes',
                    localField: 'recipe_id',
                    foreignField: '_id',
                    as: 'recipeDetail'
                }
            },
            {
                $unwind: '$recipeDetail'
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'recipeDetail._id',
                    foreignField: 'recipe_id',
                    as: 'recipeComments'
                }
            },
            {
                $project: {
                    _id: '$recipeDetail._id',
                    recipe_name: '$recipeDetail.recipe_name',
                    author: '$recipeDetail.author',
                    category: '$recipeDetail.category',
                    difficulty: '$recipeDetail.difficulty',
                    serving: '$recipeDetail.serving',
                    ingredients: '$recipeDetail.ingredients',
                    instructions: '$recipeDetail.instructions',
                    prepTime: '$recipeDetail.prepTime',
                    cookingTime: '$recipeDetail.cookingTime',
                    image: '$recipeDetail.image',
                    likes: '$recipeDetail.likes',
                    isLiked: { $literal: true },
                    commentsCount: { $size: '$recipeComments' },
                    createdAt: '$recipeDetail.createdAt',
                    updatedAt: '$recipeDetail.updatedAt'
                }
            }
        ]);

        Msg(res, "Loved recipes fetched successfully!", lovedRecipes);
    } catch (err) {
        console.log('Error fetching loved recipes:', err);
        next(new Error('Error fetching loved recipes!'));
    }
};
const getPopularRecipe = async (req, res, next) => {
    try {
        // Sort recipes by the length of their 'likes' array in descending order
        const popularRecipes = await recipes.aggregate([
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } }
                }
            },
            { $sort: { likesCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'recipe_id',
                    as: 'recipeComments'
                }
            },
            {$addFields: {commentsCount: { $size: '$recipeComments' }}},
            {$project: { recipeComments: 0 }}
        ]);

        Msg(res, "Popular recipes fetched successfully!", popularRecipes);
    } catch (err) {
        console.log('Error fetching popular recipes:', err);
        next(new Error('Error fetching popular recipes!'));
    }
};
const getLatestRecipe = async (req, res, next) => {
    try {
        const latestRecipes = await recipes.aggregate([
            { $sort: { createAt: -1 } },
            { $limit: 10 },
            {$lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'recipe_id',
                    as: 'recipeComments'
                }},
            {$addFields: {commentsCount: { $size: '$recipeComments' }}},
            {$project: { recipeComments: 0 }}
        ]);
        Msg(res, "Latest recipes fetched successfully!", latestRecipes);
    } catch (err) {
        console.log('Error fetching latest recipes:', err);
        next(new Error('Error fetching latest recipes!'));
    }
};

module.exports = {
    getAll,
    createRecipe,
    deleteRecipe,
    getRecipeDetails,
    getMyRecipes,
    basedOnType,
    editRecipe,searchWithAnything,
    getLovedRecipes, getPopularRecipe, getLatestRecipe,
}