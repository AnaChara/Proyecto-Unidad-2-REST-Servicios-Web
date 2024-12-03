const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Rutas
const userRoutes = require('./routes/userRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/shCartRoutes');

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middlewares globales
app.use(express.json()); // Parsear JSON
app.use(cors()); // Habilitar CORS

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);  // Aquí usamos la variable de entorno MONGO_URI
    console.log('Base de datos conectada');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error.message);
    process.exit(1); // Detener el proceso si falla la conexión
  }
};

connectDB();

module.exports = app;
