const { check, validationResult } = require('express-validator');

// Middleware de validación de datos para crear o actualizar un usuario
const validateUserData = [
  check('nombreCompleto').notEmpty().withMessage('El nombre completo es obligatorio'),
  check('email').isEmail().withMessage('El correo electrónico debe ser válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('RFC').notEmpty().withMessage('El RFC es obligatorio'),
  check('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  check('zipCode').isNumeric().withMessage('El código postal debe ser un número'),
  check('telefono').notEmpty().withMessage('El teléfono es obligatorio'),
  check('metodoPagoPreferido').isArray().withMessage('El método de pago preferido debe ser un array de valores'),

  // Middleware que valida los errores
  (req, res, next) => {
    const errors = validationResult(req);  // Obtener los errores de validación
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasamos al siguiente middleware o controlador
  }
];

module.exports = { validateUserData };
