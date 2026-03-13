const Brand = require('../models/Brand');

// UC-06/18/35: View Brand List (Guest / Customer / Manager)
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort('name');
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found.' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-35 (CRUD) / Manager: Create Brand
const createBrand = async (req, res) => {
  try {
    const { name, description, logo, website } = req.body;
    if (!name) return res.status(400).json({ message: 'Brand name is required.' });
    const brand = await Brand.create({ name, description, logo, website });
    res.status(201).json({ message: 'Brand created.', brand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-35 (CRUD) / Manager: Update Brand
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found.' });
    res.json({ message: 'Brand updated.', brand });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-35 (CRUD) / Manager: Delete Brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!brand) return res.status(404).json({ message: 'Brand not found.' });
    res.json({ message: 'Brand deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand };
