const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById, createOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-26: Customer - View own orders (RD)
router.get('/my', authenticate, authorize('customer'), getMyOrders);

// UC-26: Customer - View single order detail (RD)
router.get('/my/:id', authenticate, authorize('customer'), getOrderById);

// UC-27: Customer - Create order
router.post('/', authenticate, authorize('customer'), createOrder);

// UC-26: Customer - Cancel order (RD)
router.put('/my/:id/cancel', authenticate, authorize('customer'), cancelOrder);

// Manager / Admin - View all orders
router.get('/', authenticate, authorize('manager', 'admin'), getAllOrders);

// Manager / Admin - Update order status
router.put('/:id/status', authenticate, authorize('manager', 'admin'), updateOrderStatus);

module.exports = router;
