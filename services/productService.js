const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const facturapi = require('../apis/facturapi');

module.exports = {
    getAllProducts: async () => {
        try {
            return await Product.find();
        } catch (error) {
            throw new Error('Error al recuperar productos')
        }
    },

    getProductById: async (_id) => {
        try {
            if (!_id) {
                throw new Error('ID de producto es obligatorio.');
            }
            const product = await Product.findById(_id);
            if (!product) {
                throw new Error(`Producto con ID: ${_id} no encontrado.`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    },

    createProduct: async ({ name, desc, price, category, brand, quantity, images }) => {
        try {
            if (!name || !desc || !price || !category || !brand || !quantity || !images) {
                throw new Error('Todos los campos son obligatorios.');
            }
            const brandExists = await Brand.findById(brand);
            if (!brandExists) {
                throw new Error(`Marca con ID: ${brand} no encontrada.`);
            }
            const product = new Product({ name, desc, price, category, brand: brand, quantity, images });
            const facturapiProduct = await facturapi.createProduct(product);
            product.facturapi = facturapiProduct.id;
            return await product.save();
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (_id, updates) => {
        try {
            if (!_id) {
                throw new Error('ID de producto es obligatorio.');
            }
            const product = await Product.findById(_id);
            if (!product) {
                throw new Error(`Producto con ID: ${_id} no encontrado.`);
            }
            const facturapiData = {
                description: updates.desc || product.desc,
                price: updates.price || product.price,
                product_key: "50202306"
            };
            await facturapi.updateProduct(product.facturapi, facturapiData);
            return await Product.findByIdAndUpdate(_id, updates, { new: true });
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (_id) => {
        try {
            if (!_id) {
                throw new Error('ID de producto es obligatorio.');
            }
            const product = await Product.findById(_id);
            if (!product) {
                throw new Error(`Producto con ID: ${_id} no encontrado.`);
            }
            const productDeleted = await facturapi.deleteProduct(product.facturapi);
            if (!productDeleted) throw new Error(`Producto con ID: ${_id} no puede ser eliminado de Facturapi.`);
            return await Product.findByIdAndDelete(_id);
        } catch (error) {
            throw error;
        }
    },

    getBrandById: async (brandId) => {
        return await Brand.findById(brandId);
    }
};