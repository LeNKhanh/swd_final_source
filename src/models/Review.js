const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    reply: {
      content: { type: String },
      repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      repliedAt: { type: Date },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Each user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
