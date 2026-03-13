const mongoose = require('mongoose');

// Snapshot of product at order time — preserved even if product is later edited/deleted
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },       // snapshot
  productImage: { type: String },                       // snapshot
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },        // human-readable: ORD-20260001
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      // Optional reference to saved UserAddress (for traceability)
      userAddressRef: { type: mongoose.Schema.Types.ObjectId, ref: 'UserAddress', default: null },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cod', 'vnpay'], default: 'cod' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    note: { type: String },
  },
  { timestamps: true }
);

// Auto-generate orderNumber before saving if not set
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
