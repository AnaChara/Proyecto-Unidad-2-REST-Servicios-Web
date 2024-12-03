const jwt = require('jsonwebtoken');

// Middleware para autenticar el token JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token del encabezado

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded;  // Almacenar el usuario decodificado en el objeto de la solicitud
    next();  // Pasar al siguiente middleware o controlador
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = { authenticateJWT };
