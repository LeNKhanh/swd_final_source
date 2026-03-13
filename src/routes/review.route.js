const express = require('express');
const router = express.Router();
const { getReviewsByProduct, getAllReviews, createReview, replyToReview, deleteReview } = require('../controllers/review.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// UC-07: Guest - View reviews for a product (public)
router.get('/product/:productId', getReviewsByProduct);

// UC-37: Manager / Admin - View all reviews (RD)
router.get('/', authenticate, authorize('manager', 'admin'), getAllReviews);

// Customer - Create review
router.post('/', authenticate, authorize('customer'), createReview);

// UC-38: Manager / Admin - Reply to a review
router.post('/:id/reply', authenticate, authorize('manager', 'admin'), replyToReview);

// UC-37: Manager / Admin - Delete review (RD)
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteReview);

module.exports = router;
