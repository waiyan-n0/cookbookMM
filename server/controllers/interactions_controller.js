const likes = require('./../models/like_model');
const recipes = require('./../models/recipe_model');
const comments = require('./../models/comment_model');
const {Msg} = require('./../utils/helperFunc');
const { ObjectId } = require('mongodb');

const like = async (req, res, next) => {
    try {
        const { recipe_id } = req.body;
        const reactor_id = req.userId;

        if (!recipe_id) {
            next(new Error('Recipe not found'));
            return;
        }
        const isLikeExist = await likes.findOneAndDelete({ recipe_id, reactor_id });

        if (isLikeExist) {
            const updatedRecipe = await recipes.findByIdAndUpdate(
                recipe_id,
                { $pull: { likes: reactor_id } },
                { returnDocument: 'after' }
            );
            return Msg(res, 'Unlike Successfully!', {isLiked: false, likes_count: updatedRecipe && updatedRecipe.likes ? updatedRecipe.likes.length : 0});
        }

        await new likes({ recipe_id, reactor_id }).save();
        const updatedRecipe = await recipes.findByIdAndUpdate(
            recipe_id,
            { $push: { likes: reactor_id } },
            { returnDocument: 'after' }
        );
        return Msg(res, 'Liked Successfully!', {isLiked: true, likes_count: updatedRecipe && updatedRecipe.likes ? updatedRecipe.likes.length : 0});
    } catch (err) {
        console.log('Error giving like: ', err);
        next(new Error('Error like!'));

    }
}
const checkLikeStatus = async (req, res, next) => {
    try {
        const { recipe_id } = req.params;
        const reactor_id = req.userId;
        const isLikedRecord = await likes.findOne({ recipe_id, reactor_id });

        return Msg(res, 'Success', {isLiked: !!isLikedRecord});
    } catch (err) {
        console.log('error checking like status!', err);
        next(new Error('Error checking like status.'));
    }
}

const postComment = async (req, res, next) => {
    try {
        const { recipe_id, text } = req.body;
        const user_id = req.userId;

        if (!recipe_id || !text) {
            return res.status(400).json({ con: false, msg: 'Recipe ID and text are required!' });
        }

        const newComment = new comments({recipe_id, user_id, text});
        await newComment.save();

        // UI မှာ ချက်ချင်း User ရဲ့ နာမည်ပြနိုင်အောင် user_id ထဲက name ကိုပါဆွဲထုတ် (populate) ပေးလိုက်မယ်
        const populatedComment = await comments.findById(newComment._id).populate('user_id', 'name');

        return res.status(201).json({
            con: true,
            msg: 'Comment posted successfully!',
            result: {
                _id: populatedComment._id,
                text: populatedComment.text,
                createdAt: populatedComment.createdAt,
                author: {
                    name: populatedComment.user_id ? populatedComment.user_id.name : 'Anonymous'
                }
            }
        });
    } catch (err) {
        console.error('Error posting comment:', err);
        next(err);
    }
};
const getCommentsByRecipe = async (req, res, next) => {
    try {
        const { recipeId } = req.params;
        //const recipeID = ObjectId.createFromHexString(recipeId);
        // console.log('in interaction: ',recipeId);
        const allComments = await comments.find({ recipe_id: recipeId }).populate('user_id', 'name').sort({ createdAt: -1 });

        const formattedComments = allComments.map(cmt => ({
            _id: cmt._id,
            user_id: cmt.user_id._id,
            text: cmt.text,
            createdAt: cmt.createdAt,
            author: {
                name: cmt.user_id ? cmt.user_id.name : 'Anonymous'
            }
        }));
    Msg(res, 'Show Comment', formattedComments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        next(new Error('error fetching comments.'));
    }
};
const deleteComment =async(req, res, next) =>{
    try{
        const {comment_id} = req.body;
        const deletedComment = await comments.findByIdAndDelete(comment_id);
        if(!deletedComment){
            next(new Error('Failed to delete comment!'));
        }
        Msg(res, 'Your comment have been deleted!', deletedComment);
    }catch(err){
        console.log('Error deleting comment: ',err);
        next(new Error('Error deleting comment!'));
    }
}
module.exports = {
    like, checkLikeStatus, postComment,
    getCommentsByRecipe, deleteComment
}