const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { addReview, getAllReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', protect, addReview);
router.get('/', getAllReviews);
router.delete('/:id', protect, admin, deleteReview);

module.exports = router;