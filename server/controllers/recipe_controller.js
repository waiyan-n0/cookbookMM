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
const getAll = async(req, res, next) => {
    try {
        const currentUser = req.userId ? new mongoose.Types.ObjectId(req.userId) : null;
        const allRecipes = await recipes.find();

        Msg(res, 'All Recipes', allRecipes);

    } catch(err) {
        console.log(err);
        next(new Error('Error getting all recipes.'));
    }
}

const basedOnType = async(req, res, next) => {
    try {
        const type = req.params.type;
        const recipes_list = await recipes.find({
            category: { $regex: new RegExp(`^${type}$`, 'i') }
        });

        Msg(res, "Recipes that are matched with your type!", recipes_list);
    } catch(err) {
        console.log(err);
        next(new Error('Error getting basedOnType!'));
    }
}
const getMyRecipes = async(req,res,next) => {
    try{
        const { id } = req.params;
        const myRecipes = await recipes.find({"author.id":id});
        if (!myRecipes || myRecipes.length === 0){
            Msg(res, "You haven't create any recipes yet!", myRecipes);
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

module.exports = {
    getAll,
    createRecipe,
    deleteRecipe,
    getRecipeDetails,
    getMyRecipes,
    basedOnType,
    editRecipe,
}