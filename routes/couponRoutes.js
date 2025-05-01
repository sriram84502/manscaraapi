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

// User routes
router.post('/validate', protect, validateCoupon);
router.get('/', protect, getAvailableCoupons);

// Admin routes
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;