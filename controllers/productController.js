const Product = require('../models/productModel');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('brand');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand');
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { name, desc, price, category, brand, quantity, images, facturapi } = req.body;

  const newProduct = new Product({
    name, desc, price, category, brand, quantity, images, facturapi
  });

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { name, desc, price, category, brand, quantity, images, facturapi } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, desc, price, category, brand, quantity, images, facturapi },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
