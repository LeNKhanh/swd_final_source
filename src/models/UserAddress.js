const mongoose = require('mongoose');

/**
 * UserAddress — saved shipping addresses for a customer (1-to-many with User)
 * Used for quick address selection at checkout, referenced optionally in Order.shippingAddress.userAddressRef
 */
const userAddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    province: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Only one default address per user
userAddressSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model('UserAddress', userAddressSchema);
