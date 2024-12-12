const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
//const { validateBrandData } = require('../middlewares/brandMiddleware');

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.post('/', brandController.createBrand);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

// router.post('/', validateBrandData, brandController.createBrand);
// router.put('/:id', validateBrandData, brandController.updateBrand);

module.exports = router;