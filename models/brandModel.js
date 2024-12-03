const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name:           { type: String, required: true, unique: true },
    CountryOrigin:  { type: String, required: true },
    alias:          { type: [String], default: [] }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
