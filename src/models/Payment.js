const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['vnpay', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String },
    vnpayData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Prevent duplicate successful payment for the same order
paymentSchema.index({ order: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
