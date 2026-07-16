const mongoose = require('mongoose');
const {Schema} = mongoose;

const likeSchema = new Schema({
    recipe_id: { type: Schema.Types.ObjectId, ref: 'recipes', required: true },
    reactor_id: { type: Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });

likeSchema.index({ recipe_id: 1, reactor_id: 1 }, { unique: true });

const likes = mongoose.model('likes', likeSchema);

module.exports = likes;