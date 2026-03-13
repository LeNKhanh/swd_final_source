const Product = require('../models/Product');

// UC-01/10: View Product List (Guest / Customer / All)
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand, minPrice, maxPrice, sort = '-createdAt' } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name').populate('brand', 'name').skip(skip).limit(parseInt(limit)).sort(sort),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-03/12: Search Product (Guest / Customer)
const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required.' });
    const skip = (page - 1) * limit;
    const filter = { isActive: true, $text: { $search: q } };
    const [products, total] = await Promise.all([
      Product.find(filter, { score: { $meta: 'textScore' } }).populate('category', 'name').populate('brand', 'name').skip(skip).limit(parseInt(limit)).sort({ score: { $meta: 'textScore' } }),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-04/13: Filter Product (Guest / Customer)
const filterProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, color, material, rating, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (color) filter.color = { $in: Array.isArray(color) ? color : [color] };
    if (material) filter.material = { $regex: material, $options: 'i' };
    if (rating) filter.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name').populate('brand', 'name').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-02/11: View Product Detail (Guest / Customer)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
      .populate('category', 'name description')
      .populate('brand', 'name logo');
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-33 (CRUD) / Manager: Create Product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-32/33 (CRUD) / Manager: Update Product (RUD)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated.', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-32/33 (CRUD) / Manager: Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllProducts, searchProducts, filterProducts, getProductById, createProduct, updateProduct, deleteProduct };
