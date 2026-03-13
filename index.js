require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./src/routes/auth.route'));
app.use('/api/users',      require('./src/routes/user.route'));
app.use('/api/products',   require('./src/routes/product.route'));
app.use('/api/categories', require('./src/routes/category.route'));
app.use('/api/brands',     require('./src/routes/brand.route'));
app.use('/api/cart',       require('./src/routes/cart.route'));
app.use('/api/orders',     require('./src/routes/order.route'));
app.use('/api/reviews',    require('./src/routes/review.route'));
app.use('/api/payments',   require('./src/routes/payment.route'));
app.use('/api/stats',      require('./src/routes/stats.route'));

// Health check
app.get('/', (req, res) => res.json({ message: 'SWD Furniture E-Commerce API is running!' }));

// 404 Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
