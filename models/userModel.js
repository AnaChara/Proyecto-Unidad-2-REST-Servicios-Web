const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombreCompleto:   { type: String, required: true },
    email:            { type: String, required: true, unique: true },
    password:         { type: String, required: true },
    RFC:              { type: String, required: true },
    direccion:        { type: String, required: true },
    zipCode:          { type: Number, required: true },
    telefono:         { type: String, required: true },
    fechaRegistro:    { type: Date,   default: Date.now },
    tipoUsuario:      { type: String, enum: ["cliente", "admin"], default: "cliente" },
    metodoPagoPreferido: { 
        type: [String], 
        enum: [
            "Credito",
            "Debito",
            "Transferencia",
            "Deposito"
        ],
        required: true
    },
    facturapi:        { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
