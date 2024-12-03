const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');  // Importar el controlador

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener un producto por ID
router.get('/:id', productController.getProductById);

// Crear un nuevo producto
router.post('/', productController.createProduct);

// Actualizar un producto por ID
router.put('/:id', productController.updateProduct);

// Eliminar un producto por ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
