const Review = require('../models/Review');
const Product = require('../models/Product');

// Create a review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const reviewExists = await Review.findOne({ product: productId, user: req.user._id });
    if (reviewExists) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Review added', data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'firstName lastName').populate('product', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Delete a review
exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};