const likes = require('./../models/like_model');
const recipes = require('./../models/recipe_model');
// const comments = require('./../models/comment_model');
const {Msg} = require('./../utils/helperFunc');
const mongoose = require("mongoose");

// const toggleLike = async (req, res, next) => {
//     try {
//         const { recipe_id } = req.params;
//         const reactor_id = req.userId;
//
//         if (!reactor_id) {
//             Msg(res, "Login first!", {});
//         }
//
//         const existingLike = await likes.findOne({
//             recipe_id: new mongoose.Types.ObjectId(recipe_id),
//             reactor_id: new mongoose.Types.ObjectId(reactor_id)
//         });
//         let isLiked = false;
//
//         if (existingLike) {
//             await likes.findByIdAndDelete(existingLike._id);
//             isLiked = false;
//         } else {
//             await new likes({
//                 recipe_id: new mongoose.Types.ObjectId(recipe_id),
//                 reactor_id: new mongoose.Types.ObjectId(reactor_id)
//             }).save();
//             isLiked = true;
//         }
//
//         return Msg(res, isLiked ? "You liked this post!" : "You unliked this post!", { isLiked });
//
//     } catch (err) {
//         console.log('Error toggleLike: ', err);
//         next(new Error('Error giving like recipe!'));
//     }
// }
const toggleLike = async (req, res, next) => {
    try {
        const { recipe_id } = req.params;
        const currentUser = req.userId;

        const existingLike = await likes.findOne({ recipe_id, reactor_id: currentUser });
        if (existingLike) {
            await likes.findByIdAndDelete(existingLike._id);
            await recipes.findByIdAndUpdate(recipe_id, { $inc: { likeCount: -1 } });
            return Msg(res, "Unliked", { isLiked: false });
        } else {
            await likes.create({ recipe_id, reactor_id: currentUser });
            await recipes.findByIdAndUpdate(recipe_id, { $inc: { likeCount: 1 } });

            return Msg(res, "Liked", { isLiked: true });
        }
    } catch (err) {
        next(err);
    }
};
module.exports = {
    toggleLike
}