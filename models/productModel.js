const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, require: true },
    desc: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: String, require: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    quantity: { type: Number, require: true },
    cDate: { type: Date, default: Date.now },
    images: { type: [String], require: true },
    facturapi: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);