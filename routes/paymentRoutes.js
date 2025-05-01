const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyPayment);

module.exports = router;