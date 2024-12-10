const shCartService = require('../services/shCartService');
const Product = require('../models/productModel');

const getAllCarts = async (req, res) => {
  try {
    const carts = await shCartService.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos de compras', error });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await shCartService.getShoppingCartById(req.params.id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito de compras', error });
  }
};

const getCartByUserId = async (req, res) => {
  const {user} = req.params;
  try {
    const cart = await shCartService.getShoppingCartByUserId(user);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito de compras', error });
  }
};

const createCart = async (req, res) => {
  const { user } = req.body;

  try {
    const newCart = await shCartService.createShoppingCart({user});

    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el carrito de compras', error });
  }
};

const updateCart = async (req, res) => {
  const { productos, subtotal, total, status, facturapi } = req.body;
  const { id } = req.params;

  try {
      const updates = { productos, subtotal, total, status, facturapi };
      const updatedCart = await shCartService.updateShCart(id, updates);

      if (!updatedCart) {
          return res.status(404).json({ message: 'Carrito no encontrado' });
      }

      res.json(updatedCart);
  } catch (error) {
      console.error('Error al actualizar carrito:', error);
      res.status(400).json({
          message: 'Error al actualizar el carrito de compras',
          error: error.message || 'Error desconocido',
      });
  }
};

const deleteCart = async (req, res) => {
  const {id} = req.params;
  try {
    const deletedCart = await shCartService.delShoppinCart(id);

    if (!deletedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito de compras', error });
  }
};


const addItemToCart = async (req, res) => {
  const { id: cartId } = req.params; // ID del carrito desde los parámetros
  const input = req.body; // Productos a agregar desde el cuerpo de la solicitud

  try {
      const updatedCart = await shCartService.addItemToCart(cartId, input);

      res.status(200).json({
          message: 'Productos agregados exitosamente al carrito',
          cart: updatedCart,
      });
  } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      res.status(400).json({
          message: 'Error al agregar productos al carrito',
          error: error.message || 'Error desconocido',
      });
  }
};

const updateCartItem = async (req, res) => {
  const { id: userId } = req.params;
  const input = req.body; 

  try {
      const updatedCart = await shCartService.updateCartItem(userId, input);

      res.status(200).json({
          message: 'Producto actualizado exitosamente en el carrito.',
          cart: updatedCart,
      });
  } catch (error) {
      console.error('Error al actualizar producto en el carrito:', error);
      res.status(400).json({
          message: 'Error al actualizar producto en el carrito.',
          error: error.message || 'Error desconocido.',
      });
  }
};

// Eliminar un ítem del carrito
const deleteItemFromCart = async (req, res) => {
  const { user, id } = req.params; // Asumiendo que los parámetros userId y productId se pasan en la URL

  try {
    const updatedCart = await shCartService.removeItemFromCart(user, id);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const clearCart = async(req, res) => {
  const { user } = req.params;

  try {
    const clearCart = await shCartService.clearCart(user);
    res.status(200).json(clearCart);
  }catch (error) {
    res.status(400).json({ message: error.message });
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
  clearCart
};