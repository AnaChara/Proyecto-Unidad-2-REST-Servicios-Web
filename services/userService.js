const User = require('../models/userModel');
const facturapi = require('../apis/facturapi');

module.exports = {
    getAllUsers: async () => {
        return await User.find();
    },

    getUserById: async (_id) => {
        return await User.findById(_id);
    },

    createUser: async ({nombreCompleto, email, password, RFC,direccion,zipCode, telefono, fechaRegistro,tipoUsuario,metodoPagoPreferido}) => {
        const user = new User({nombreCompleto, email, password, RFC,direccion,zipCode, telefono, fechaRegistro,tipoUsuario,metodoPagoPreferido});
        const facturapiClient = await facturapi.createClient(user);
        
        user.facturapi = facturapiClient.id;
        return await user.save();
    },

    deleteUser: async (_id) => {
        const user = await User.findById(_id);
        if (!user) throw new Error(`User with ID: ${_id} not found.`);

        const clientDeleted = await facturapi.deleteClient(user.facturapi);
        if (!clientDeleted) throw new Error(`User with ID: ${_id} couldn't be deleted from Facturapi.`);

        return await User.findByIdAndDelete(_id);
    },

    updateUser: async (_id, updates) => {
        const user = await User.findById(_id);
        if (!user) throw new Error(`User with ID: ${_id} not found.`);

        const facturapiData = {
          legal_name: updates.nombreCompleto || user.nombreCompleto,
          email: updates.email || user.email,
          address: { zip: (updates.zipCode || user.zipCode).toString() }
        };

        await facturapi.updateClient(user.facturapi, facturapiData);
        return await User.findByIdAndUpdate(_id, updates, { new: true });
    }
};