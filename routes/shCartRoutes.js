const express = require('express');
const router = express.Router();
const cartController = require('../controllers/shCartController');
const { validateCartItemData } = require('../middlewares/shCartMiddleware');

// Obtener todos los carritos de compras
router.get('/', cartController.getAllCarts);

// Obtener un carrito de compras por ID
router.get('/:id', cartController.getCartById);

// Crear un nuevo carrito de compras
router.post('/', cartController.createCart);

// Actualizar un carrito de compras
router.put('/:id', cartController.updateCart);

// Eliminar un carrito de compras por ID
router.delete('/:id', cartController.deleteCart);

// Agregar un ítem al carrito
router.post('/:cartId/items', validateCartItemData, cartController.addItemToCart);

// Eliminar un ítem del carrito
router.delete('/:cartId/items/:itemId', cartController.deleteItemFromCart);

module.exports = router;
