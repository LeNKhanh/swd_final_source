const express = require('express');
const router = express.Router();
const { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-06/18/35: Guest / Customer - View brands (public)
router.get('/', getAllBrands);
router.get('/:id', getBrandById);

// UC-35 (CRUD): Manager / Admin - Create brand
router.post('/', authenticate, authorize('manager', 'admin'), createBrand);

// UC-35 (CRUD): Manager / Admin - Update brand
router.put('/:id', authenticate, authorize('manager', 'admin'), updateBrand);

// UC-35 (CRUD): Manager / Admin - Delete brand
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteBrand);

module.exports = router;
