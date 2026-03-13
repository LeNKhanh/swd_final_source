const express = require('express');
const router = express.Router();
const { createPayment, vnpayCheckout, vnpayReturn } = require('../controllers/payment.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-28: Customer - Create payment
router.post('/', authenticate, authorize('customer'), createPayment);

// UC-29: Customer - VNPay checkout (generate payment URL)
router.post('/vnpay-checkout', authenticate, authorize('customer'), vnpayCheckout);

// VNPay return URL (callback from VNPay, no auth required)
router.get('/vnpay-return', vnpayReturn);

module.exports = router;
