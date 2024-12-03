const { validationResult } = require('express-validator');

// Middleware para validar los datos de un producto
const validateProductData = (req, res, next) => {
  const errors = validationResult(req);  // Usar express-validator para obtener errores
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();  // Si no hay errores, pasamos al siguiente middleware o controlador
};

module.exports = { validateProductData };
