const { shCart, cartItem } = require('../models/shCartModel');
const Product = require('../models/productModel');

// Obtener todos los carritos
const getAllCarts = async (req, res) => {
  try {
    const carts = await shCart.find().populate('productos.product');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos de compras', error });
  }
};

// Obtener un carrito por ID
const getCartById = async (req, res) => {
  try {
    const cart = await shCart.findById(req.params.id).populate('productos.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito de compras', error });
  }
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
  const { user, productos, subtotal, total, facturapi } = req.body;

  try {
    const newCart = new shCart({
      user,
      productos,
      subtotal: subtotal || 0,
      total: total || 0,
      facturapi
    });

    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el carrito de compras', error });
  }
};

// Actualizar un carrito
const updateCart = async (req, res) => {
  const { productos, subtotal, total, status, facturapi } = req.body;

  try {
    const updatedCart = await shCart.findByIdAndUpdate(
      req.params.id,
      { productos, subtotal, total, status, facturapi },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el carrito de compras', error });
  }
};

// Eliminar un carrito
const deleteCart = async (req, res) => {
  try {
    const deletedCart = await shCart.findByIdAndDelete(req.params.id);

    if (!deletedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito de compras', error });
  }
};

// Agregar un ítem al carrito
const addItemToCart = async (req, res) => {
  const { product, quantity } = req.body;

  try {
    const productDetails = await Product.findById(product);
    if (!productDetails) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const newItem = new cartItem({
      product: productDetails._id,
      name: productDetails.name,
      desc: productDetails.desc,
      price: productDetails.price,
      category: productDetails.category,
      quantity
    });

    const cart = await shCart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.productos.push(newItem);
    cart.subtotal += newItem.price * quantity;
    cart.total = cart.subtotal; // Aquí podrías agregar impuestos u otros cálculos

    await cart.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar ítem al carrito', error });
  }
};

// Eliminar un ítem del carrito
const deleteItemFromCart = async (req, res) => {
  try {
    const cart = await shCart.findById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const itemIndex = cart.productos.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Ítem no encontrado en el carrito' });
    }

    const itemToRemove = cart.productos.splice(itemIndex, 1);
    cart.subtotal -= itemToRemove[0].price * itemToRemove[0].quantity;
    cart.total = cart.subtotal;

    await cart.save();
    res.json({ message: 'Ítem eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el ítem del carrito', error });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  addItemToCart,
  deleteItemFromCart
};
