const Category = require('../models/Category');

// UC-15: View Categories Group List – top-level groups only (parent = null)
// UC-05/17: View Categories List – all or by parent group
const getAllCategories = async (req, res) => {
  try {
    const { groupId } = req.query;
    const filter = { isActive: true };

    if (groupId === 'root') {
      // UC-15: only top-level groups
      filter.parent = null;
    } else if (groupId) {
      // UC-17: sub-categories under a specific group
      filter.parent = groupId;
    }

    const categories = await Category.find(filter)
      .populate('parent', 'name')
      .sort('name');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-34 (CRUD) / Manager: Create Category
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });
    const category = await Category.create({ name, description, image });
    res.status(201).json({ message: 'Category created.', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-34 (CRUD) / Manager: Update Category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category updated.', category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-34 (CRUD) / Manager: Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
