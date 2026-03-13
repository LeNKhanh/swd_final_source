const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cart.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All cart routes require Customer authentication
// UC-24: View Cart (RUD)
router.get('/', authenticate, authorize('customer'), getCart);

// UC-25: Add to Cart
router.post('/items', authenticate, authorize('customer'), addToCart);

// UC-24: Update cart item (RUD)
router.put('/items/:itemId', authenticate, authorize('customer'), updateCartItem);

// UC-24: Remove cart item (RUD)
router.delete('/items/:itemId', authenticate, authorize('customer'), removeCartItem);

// Clear entire cart
router.delete('/', authenticate, authorize('customer'), clearCart);

module.exports = router;
