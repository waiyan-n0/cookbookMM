const mongoose = require('mongoose');
const {Schema} = mongoose;

const recipeSchema = new Schema({
    recipe_name: {type: String, required: true},
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true }
    },
    category: [{type: String, required: true}],
    difficulty: [{type: String,enum:['Easy','Medium','Hard'], default:'Easy'}],
    serving: {type: Number, required: true},
    ingredients: [{
        name: {type: String, required: true},
        amount: {type: String, required: true},
        unit: {type: String}
    }],
    instructions: [{type:String, required: true}],
    prepTime: {type: String, required: true},
    cookingTime: {type: String, required: true},
    image: {type: String, required: true},
    createAt: {type: Date, default: Date.now},
});

const recipes = mongoose.model('recipes', recipeSchema);

module.exports = recipes;