const Cart = require('../models/Cart');
const Product = require('../models/Product');

// UC-24: View Cart (Customer - RUD)
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');
    if (!cart) return res.json({ items: [], totalPrice: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-25: Add to Cart (Customer)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required.' });

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock.' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.discountPrice || product.price });
    }
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    res.json({ message: 'Added to cart.', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-24: Update cart item quantity (Customer - RUD)
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1.' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found.' });

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    res.json({ message: 'Cart updated.', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UC-24: Remove cart item (Customer - RUD)
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ message: 'Item removed from cart.', cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
