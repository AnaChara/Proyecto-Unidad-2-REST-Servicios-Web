const mongoose = require('mongoose');

// Esquema del ítem del carrito
const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
});

// Esquema del carrito de compras
const shCartSchema = new mongoose.Schema({
    user: { type: [String], required: true }, // Aquí podrías usar un modelo de Usuario si es necesario
    productos: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    sDate: { type: Date, default: Date.now },
    cDate: { type: Date, default: Date.now },
    status: { type: String, default: "Activo" },
    facturapi: { type: String, required: false },
});

const shCart = mongoose.model('shCart', shCartSchema);
const cartItem = mongoose.model('cartItem', cartItemSchema);

module.exports = { shCart, cartItem };
