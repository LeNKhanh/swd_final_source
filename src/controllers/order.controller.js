const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// UC-26: View Orders (Customer - RD)
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('items.product', 'name images price').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-26: Get order detail (Customer - RD)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-27: Create Order (Customer)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cod', note } = req.body;
    if (!shippingAddress) return res.status(400).json({ message: 'Shipping address is required.' });

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty.' });

    // Validate stock
    for (const item of cart.items) {
      if (!item.product.isActive) return res.status(400).json({ message: `Product "${item.product.name}" is no longer available.` });
      if (item.product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for "${item.product.name}".` });
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      productName: i.product.name,                            // snapshot
      productImage: (i.product.images && i.product.images[0]) || null, // snapshot
      quantity: i.quantity,
      price: i.price,
    }));

    const order = await Order.create({ user: req.user._id, items, totalPrice: cart.totalPrice, shippingAddress, paymentMethod, note });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

    await order.populate('items.product', 'name images price');
    res.status(201).json({ message: 'Order created successfully.', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-26: Cancel Order (Customer - RD)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage.' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled.', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').populate('items.product', 'name price').skip(skip).limit(parseInt(limit)).sort('-createdAt'),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager/Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order status updated.', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyOrders, getOrderById, createOrder, cancelOrder, getAllOrders, updateOrderStatus };
