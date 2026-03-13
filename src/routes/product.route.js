const express = require('express');
const router = express.Router();
const { getAllProducts, searchProducts, filterProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-01/10: Guest / Customer / All - View product list (public)
router.get('/', getAllProducts);

// UC-03/12: Guest / Customer - Search products (public)
router.get('/search', searchProducts);

// UC-04/13: Guest / Customer - Filter products (public)
router.get('/filter', filterProducts);

// UC-02/11: Guest / Customer - View product detail (public)
router.get('/:id', getProductById);

// UC-32 (CRUD): Manager / Admin - Create product
router.post('/', authenticate, authorize('manager', 'admin'), createProduct);

// UC-32/33 (CRUD/RUD): Manager / Admin - Update product
router.put('/:id', authenticate, authorize('manager', 'admin'), updateProduct);

// UC-32/33 (CRUD): Manager / Admin - Delete product
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteProduct);

module.exports = router;
