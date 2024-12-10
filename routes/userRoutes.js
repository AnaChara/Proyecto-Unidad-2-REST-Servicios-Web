const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { validateUserData } = require('../middlewares/userMiddleware');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// router.post('/', validateUserData, userController.createUser);
// router.put('/:id', validateUserData, userController.updateUser);

// Login de usuario
router.post('/login', userController.loginUser);

module.exports = router;