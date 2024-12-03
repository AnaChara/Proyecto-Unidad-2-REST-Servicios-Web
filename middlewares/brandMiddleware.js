const { check, validationResult } = require('express-validator');

// Middleware de validación de datos para crear o actualizar una marca
const validateBrandData = [
  check('name').notEmpty().withMessage('El nombre de la marca es obligatorio'),
  check('CountryOrigin').notEmpty().withMessage('El país de origen es obligatorio'),

  // Middleware que valida el cuerpo de la solicitud
  (req, res, next) => {
    const errors = validationResult(req);  // Obtener errores de la validación
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasamos al siguiente middleware o controlador
  }
];

module.exports = { validateBrandData };
