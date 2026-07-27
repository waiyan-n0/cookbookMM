const express = require('express');
const router = express.Router();
const interaction = require('../controllers/interactions_controller');
const { verifyToken } = require('../middlewares/auth_middleware');

router.get('/:recipe_id/like-status', verifyToken, interaction.checkLikeStatus);
router.post('/like', verifyToken, interaction.like);

router.get('/:recipeId/comments', interaction.getCommentsByRecipe );
router.post('/comment', verifyToken, interaction.postComment);
router.delete('/comment', interaction.deleteComment);


module.exports = router;