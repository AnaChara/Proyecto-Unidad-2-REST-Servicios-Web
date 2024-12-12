const User = require('../models/userModel');
const facturapi = require('../apis/facturapi');

module.exports = {
    getAllUsers: async () => {
        try {
            return await User.find();
        } catch (error) {
            throw new Error('Error al recuperar los usuarios');
        }
    },

    getUserById: async (_id) => {
        try {
            const user = await User.findById(_id);
            if (!user) {
                throw new Error(`Usuario con ID: ${_id} no encontrado.`);
            }
            return user;
        } catch (error) {
            throw error;
        }
    },

    createUser: async ({ nombreCompleto, email, password, RFC, direccion, zipCode, telefono, fechaRegistro, tipoUsuario, metodoPagoPreferido }) => {
        try {
            if (!nombreCompleto || !email || !password || !RFC || !direccion || !zipCode || !telefono || !fechaRegistro || !tipoUsuario || !metodoPagoPreferido) {
                throw new Error('Todos los campos son obligatorios.');
            }
            const user = new User({ nombreCompleto, email, password, RFC, direccion, zipCode, telefono, fechaRegistro, tipoUsuario, metodoPagoPreferido });
            const facturapiClient = await facturapi.createClient(user);
            user.facturapi = facturapiClient.id;
            return await user.save();
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (_id, updates) => {
        try {
            const user = await User.findById(_id);
            if (!user) {
                throw new Error(`Usuario con ID: ${_id} no encontrado.`);
            }
            const facturapiData = {
                legal_name: updates.nombreCompleto || user.nombreCompleto,
                email: updates.email || user.email,
                address: { zip: (updates.zipCode || user.zipCode).toString() }
            };
            await facturapi.updateClient(user.facturapi, facturapiData);
            return await User.findByIdAndUpdate(_id, updates, { new: true });
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (_id) => {
        try {
            const user = await User.findById(_id);
            if (!user) {
                throw new Error(`Usuario con ID: ${_id} no encontrado.`);
            }
            const clientDeleted = await facturapi.deleteClient(user.facturapi);
            if (!clientDeleted) throw new Error(`Usuario con ID: ${_id} no puede ser eliminado de Facturapi.`);
            return await User.findByIdAndDelete(_id);
        } catch (error) {
            throw error;
        }
    },
};