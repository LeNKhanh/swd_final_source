const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
      depth: { type: Number },
    },
    material: { type: String },
    color: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', material: 'text' });

module.exports = mongoose.model('Product', productSchema);
