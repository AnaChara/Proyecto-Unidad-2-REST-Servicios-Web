const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserData } = require('../middlewares/userMiddleware');

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Crear un nuevo usuario
router.post('/', validateUserData, userController.createUser);

// Actualizar un usuario por ID
router.put('/:id', validateUserData, userController.updateUser);

// Eliminar un usuario por ID
router.delete('/:id', userController.deleteUser);

// Login de usuario
router.post('/login', userController.loginUser);

module.exports = router;
