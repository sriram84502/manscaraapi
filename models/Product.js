const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  volume: { type: String },
  stock: { type: Number, default: 0, min: 0 },
  images: { type: [String], default: [] },
  skinType: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  advantages: { type: [String], default: [] },
  uses: { type: [String], default: [] },
  category: { type: String, default: 'general' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);