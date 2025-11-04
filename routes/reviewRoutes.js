const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { addReview, getAllReviews, deleteReview } = require('../controllers/reviewController');

// Add a review - user auth required
router.post('/', protect, addReview);

// Get all reviews - no auth required
router.get('/', getAllReviews);

// Delete a review - admin auth required
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;