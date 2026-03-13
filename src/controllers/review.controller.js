const Review = require('../models/Review');
const Product = require('../models/Product');

// UC-07: View Reviews/Feedback (Guest - public)
const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find({ product: productId, isActive: true }).populate('user', 'name avatar').populate('reply.repliedBy', 'name').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
      Review.countDocuments({ product: productId, isActive: true }),
    ]);
    res.json({ reviews, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-37: View all reviews (Manager/Admin - RD)
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, productId } = req.query;
    const filter = {};
    if (productId) filter.product = productId;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('user', 'name email').populate('product', 'name').populate('reply.repliedBy', 'name').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
      Review.countDocuments(filter),
    ]);
    res.json({ reviews, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer: Create Review
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) return res.status(400).json({ message: 'productId, rating and comment are required.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(409).json({ message: 'You have already reviewed this product.' });

    const review = await Review.create({ user: req.user._id, product: productId, rating, comment });

    // Update product rating
    const allReviews = await Review.find({ product: productId, isActive: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length });

    res.status(201).json({ message: 'Review created.', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-38: Reply to Review (Manager / Admin)
const replyToReview = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Reply content is required.' });

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { reply: { content, repliedBy: req.user._id, repliedAt: new Date() } },
      { new: true }
    ).populate('user', 'name').populate('reply.repliedBy', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found.' });

    res.json({ message: 'Reply added.', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-37: Delete Review (Manager / Admin - RD)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found.' });
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviewsByProduct, getAllReviews, createReview, replyToReview, deleteReview };
