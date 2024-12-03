const { check, validationResult } = require('express-validator');

// Middleware de validación para agregar un producto al carrito
const validateCartItemData = [
  check('product').isMongoId().withMessage('El ID del producto es inválido'),
  check('quantity').isNumeric().withMessage('La cantidad debe ser un número'),
  
  // Middleware que valida los errores
  (req, res, next) => {
    const errors = validationResult(req);  // Obtener los errores de validación
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasamos al siguiente middleware o controlador
  }
];

module.exports = { validateCartItemData };
