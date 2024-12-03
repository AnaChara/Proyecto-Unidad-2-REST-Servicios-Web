// index.js
const app = require('./app');  // Importar la aplicación de Express
const dotenv = require('dotenv');

// Configuración de dotenv
dotenv.config();

// Puerto de la aplicación
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
