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
router.put('/cart/:id/item', cartController.updateCartItem);
router.delete('/:id/product/:product', cartController.deleteItemFromCart);
router.delete('/:id/item/:product', cartController.deleteOneItemFromCart);
router.delete('/items/:user', cartController.clearCart);

module.exports = router;