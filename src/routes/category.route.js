const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-05/15/17: Guest / Customer - View categories (public)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// UC-34 (CRUD): Manager / Admin - Create category
router.post('/', authenticate, authorize('manager', 'admin'), createCategory);

// UC-34 (CRUD): Manager / Admin - Update category
router.put('/:id', authenticate, authorize('manager', 'admin'), updateCategory);

// UC-34 (CRUD): Manager / Admin - Delete category
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteCategory);

module.exports = router;
