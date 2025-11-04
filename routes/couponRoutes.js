const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAvailableCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Validate coupon - user auth required
router.post('/validate', protect, validateCoupon);

// Get all available coupons - no auth required
router.get('/', getAvailableCoupons);

// Admin routes
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;