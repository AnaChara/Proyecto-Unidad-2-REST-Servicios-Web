const brandService = require('../services/brandService');

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las marcas', error: error.message });
  }
};

const getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await brandService.getBrandById(id);
    if (!brand) {
      return res.status(404).json({ message: `Marca con ID: ${id} no encontrada.` });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la marca', error: error.message });
  }
};

const createBrand = async (req, res) => {
  const { name, CountryOrigin, alias } = req.body;
  if (!name || !alias || !CountryOrigin) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const newBrand = await brandService.createBrand({ name, CountryOrigin, alias });
    res.status(201).json({ message: 'Marca creada exitosamente', newBrand });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la marca', error: error.message });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedBrand = await brandService.updateBrand(id, updates);
    if (!updatedBrand) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.status(200).json({ message: 'Marca actualizada exitosamente', updatedBrand });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la marca', error: error.message });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBrand = await brandService.deleteBrand(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.status(200).json({ message: 'Marca eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la marca', error: error.message });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};