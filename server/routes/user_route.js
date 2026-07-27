const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller.js');
const {verifyToken} = require('../middlewares/auth_middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', verifyToken, userController.getMe);
router.get('/profiles', userController.getAllUsers)
router.patch('/profile', verifyToken, userController.updateProfile);

module.exports = router;