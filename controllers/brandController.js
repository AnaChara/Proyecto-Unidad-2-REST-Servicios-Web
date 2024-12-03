const Brand = require('../models/brandModel');

// Obtener todas las marcas
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las marcas', error });
  }
};

// Obtener una marca por ID
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la marca', error });
  }
};

// Crear una nueva marca
const createBrand = async (req, res) => {
  const { name, CountryOrigin, alias } = req.body;

  try {
    const newBrand = new Brand({ name, CountryOrigin, alias });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la marca', error });
  }
};

// Actualizar una marca
const updateBrand = async (req, res) => {
  const { name, CountryOrigin, alias } = req.body;

  try {
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, CountryOrigin, alias },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }

    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la marca', error });
  }
};

// Eliminar una marca
const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }

    res.json({ message: 'Marca eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la marca', error });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};
