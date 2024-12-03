const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id:        { type: mongoose.Schema.Types.ObjectId },
    name:       { type: String, required: true },
    desc:       { type: String, required: true },
    price:      { type: Number, required: true },
    category:   { type: String, required: true },
    brand:      { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    quantity:   { type: Number, required: true },
    cDate:      { type: Date, default: Date.now },
    images:     { type: [String], required: true },
    facturapi:  { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
