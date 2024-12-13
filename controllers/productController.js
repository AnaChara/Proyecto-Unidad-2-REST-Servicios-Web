const productService = require('../services/productService');

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, desc, price, category, brand, quantity, images, facturapi } = req.body;
  if (!name || !desc || !price || !category || !brand || !quantity || !images ) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const newProduct = await productService.createProduct({ name, desc, price, category, brand, quantity, images, facturapi });;
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedProduct = await productService.updateProduct(id, updates);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};