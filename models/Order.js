const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      subtitle: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    region: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    razorpayPaymentId: String,
    nameOnCard: String,
    cardNumber: String,
    expiryDate: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },  
  total: Number,
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discountAmount: Number,
  couponCode: String,
  trackingNumber: String,
  trackingUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);