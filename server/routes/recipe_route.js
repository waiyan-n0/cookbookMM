const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/auth_middleware');
const recipeController = require("../controllers/recipe_controller");
const interactionController = require("../controllers/interactions_controller");

router.get('/types/all', recipeController.getAll);

router.get('/types/:type', recipeController.basedOnType);
router.get('/:id/recipes_list', recipeController.getMyRecipes);

router.post('/', recipeController.createRecipe);
router.put('/:id', recipeController.editRecipe);
router.delete('/:id', recipeController.deleteRecipe);

router.get('/:_id', recipeController.getRecipeDetails);

module.exports = router;