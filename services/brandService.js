const Brand = require('../models/brandModel');

module.exports = {
    getAllBrands: async () => {
        try {
            return await Brand.find();
        } catch (error) {
            throw new Error('Error al recuperar las marcas.');
        }
    },
    getBrandById: async (_id) => {
        try {
            if (!_id) {
                throw new Error('ID de marca es obligatorio.');
            }
            const brand = await Brand.findById(_id);
            if (!brand) {
                throw new Error(`Marca con ID: ${_id} no encontrada.`);
            }
            return brand;
        } catch (error) {
            throw error;
        }
    },
    createBrand: async (input) => {
        try {
            const { name, alias, CountryOrigin } = input;
            if (!name || !alias || !CountryOrigin) {
                throw new Error('Todos los campos son obligatorios.');
            }
            const brand = new Brand({ name, alias, CountryOrigin });
            return await brand.save();
        } catch (error) {
            throw error;
        }
    },
    updateBrand: async (_id, updates) => {
        try {
            if (!_id) {
                throw new Error('ID de marca es obligatorio.');
            }
            const updatedBrand = await Brand.findByIdAndUpdate(_id, updates, { new: true });
            if (!updatedBrand) {
                throw new Error(`Marca con ID: ${_id} no encontrada.`);
            }
            return updatedBrand;
        } catch (error) {
            throw error;
        }
    },
    deleteBrand: async (_id) => {
        try {
            if (!_id) {
                throw new Error('ID de marca es obligatorio.');
            }
            const deletedBrand = await Brand.findByIdAndDelete(_id);
            if (!deletedBrand) {
                throw new Error(`Marca con ID: ${_id} no encontrada.`);
            }
            return deletedBrand;
        } catch (error) {
            throw error;
        }
    }
};