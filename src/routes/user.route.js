const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile, getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { getAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-19: Customer - View own profile
router.get('/profile', authenticate, getProfile);

// UC-20: Customer - Update own profile
router.put('/profile', authenticate, updateProfile);

// UC-21: Customer - Deactivate own account
router.delete('/profile', authenticate, deleteProfile);

// Saved shipping addresses (Customer)
router.get('/addresses', authenticate, authorize('customer'), getAddresses);
router.post('/addresses', authenticate, authorize('customer'), createAddress);
router.put('/addresses/:id', authenticate, authorize('customer'), updateAddress);
router.delete('/addresses/:id', authenticate, authorize('customer'), deleteAddress);

// UC-31: Manager / Admin - View all users
router.get('/', authenticate, authorize('manager', 'admin'), getAllUsers);

// UC-31 CRUD: Admin - Get user by ID
router.get('/:id', authenticate, authorize('manager', 'admin'), getUserById);

// CRUD: Admin - Create user
router.post('/', authenticate, authorize('admin'), createUser);

// CRUD: Admin - Update user
router.put('/:id', authenticate, authorize('admin'), updateUser);

// CRUD: Admin - Delete user
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
