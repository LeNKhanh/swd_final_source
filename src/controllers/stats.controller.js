const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');

// UC-36: View Statistical Diagram (Manager / Admin)
const getStatistics = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const [totalUsers, totalProducts, totalOrders, totalRevenue, monthlySales, topProducts, ordersByStatus] = await Promise.all([
      User.countDocuments({ role: 'customer', isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }, paymentStatus: 'paid' } },
        { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $unwind: '$items' },
        { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $project: { 'product.name': 1, 'product.images': 1, totalSold: 1, revenue: 1 } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlySales,
      topProducts,
      ordersByStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStatistics };
