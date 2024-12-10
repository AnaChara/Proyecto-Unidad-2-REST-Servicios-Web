const express = require('express');
const router = express.Router();
const cartController = require('../controllers/shCartController');

router.get('/', cartController.getAllCarts);
router.get('/:id', cartController.getCartById);
router.get('/user/:user', cartController.getCartByUserId);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.post('/cart/:id/items', cartController.addItemToCart);
router.put('/cart/:id/items', cartController.updateCartItem);
router.delete('/:user/item/:id', cartController.deleteItemFromCart);
router.delete('/items/:user', cartController.clearCart);

module.exports = router;