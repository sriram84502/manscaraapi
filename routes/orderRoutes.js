const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  getOrderDetailsById,
  downloadInvoice,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);                  // 🔁 Fetch all orders
router.get('/admin/:id', protect, admin, getOrderDetailsById);          // 🔍 View single order details
router.get('/:id/invoice', protect, admin, downloadInvoice);            // 📄 Download invoice
router.put('/:id/status', protect, admin, updateOrderStatus);           // ✏️ Update status

module.exports = router;