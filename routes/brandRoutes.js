const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { validateBrandData } = require('../middlewares/brandMiddleware');

// Rutas de marcas

// Obtener todas las marcas
router.get('/', brandController.getAllBrands);

// Obtener una marca por ID
router.get('/:id', brandController.getBrandById);

// Crear una nueva marca
router.post('/', validateBrandData, brandController.createBrand);

// Actualizar una marca por ID
router.put('/:id', validateBrandData, brandController.updateBrand);

// Eliminar una marca por ID
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
