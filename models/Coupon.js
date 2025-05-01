const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: String,
  discountPercentage: { type: Number, required: true },
  minimumPurchase: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isOneTimeUse: { type: Boolean, default: false },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);