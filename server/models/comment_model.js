const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    recipe_id: { type: Schema.Types.ObjectId, ref: 'recipes', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    text: { type: String, required: true }
}, { timestamps: true });

const comments = mongoose.model('comments', commentSchema);

module.exports = comments;