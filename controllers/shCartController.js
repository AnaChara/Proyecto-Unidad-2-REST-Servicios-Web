const shCartService = require('../services/shCartService');
// const Product = require('../models/productModel');

const getAllCarts = async (req, res) => {
  try {
    const carts = await shCartService.getAllCarts();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos de compras', error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await shCartService.getCartById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: `Carrito con ID: ${req.params.id} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito de compras', error: error.message });
  }
};

const getCartByUserId = async (req, res) => {
  const { user } = req.params;
  try {
    const cart = await shCartService.getCartByUserId(user);
    if (!cart) {
      return res.status(404).json({ message: `Carrito del usuario: ${user} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito de compras', error: error.message });
  }
};

const createCart = async (req, res) => {
  const { user } = req.body;
  try {
    const newCart = await shCartService.createCart({ user });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el carrito de compras', error: error.message });
  }
};

const updateCart = async (req, res) => {
  const { productos, subtotal, total, status, facturapi } = req.body;
  const { id } = req.params;
  try {
    const updates = { productos, subtotal, total, status, facturapi };
    const updatedCart = await shCartService.updateCart(id, updates);
    if (!updatedCart) {
      return res.status(404).json({ message: `Carrito con ID: ${id} no encontrado` });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el carrito de compras', error: error.message });
  }
};

const deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCart = await shCartService.deleteCart(id);
    if (!deletedCart) {
      return res.status(404).json({ message: `Carrito con ID: ${id} no encontrado` });
    }
    res.status(200).json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito de compras', error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const { id: cartId } = req.params;
  const input = req.body;
  try {
    const updatedCart = await shCartService.addItemToCart(cartId, input);
    res.status(200).json({ message: 'Productos agregados exitosamente al carrito', updatedCart });
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar productos al carrito', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  const { id: userId } = req.params;
  const input = req.body;
  try {
    const updatedCart = await shCartService.updateCartItem(userId, input);
    res.status(200).json({ message: 'Producto actualizado exitosamente en el carrito.', updatedCart });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto en el carrito.', error: error.message });
  }
};

const deleteItemFromCart = async (req, res) => {
  const { id, product } = req.params;
  try {
    const updatedCart = await shCartService.deleteItemFromCart(id, product);
    res.status(200).json({ message: 'Producto eliminado exitosamente en el carrito.', updatedCart });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto en el carrito.', error: error.message });
  }
};

const deleteOneItemFromCart = async (req, res) => {
  const { id, product} = req.params;
  try {
    const updatedCart = await shCartService.removeOneItemFromCart(id, product);
    res.status(200).json({ message: 'Producto eliminado exitosamente en el carrito.', updatedCart });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar el producto en el carrito.', error: error.message });
  }
};

const clearCart = async (req, res) => {
  const { user } = req.params;
  try {
    const clearCart = await shCartService.clearCart(user);
    res.status(200).json({ message: 'Carrito vaciado exitosamente.', clearCart });
  } catch (error) {
    res.status(400).json({ message: 'Error al vaciar el carrito.', error: error.message });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  addItemToCart,
  deleteItemFromCart,
  getCartByUserId,
  updateCartItem,
  clearCart,
  deleteOneItemFromCart
};