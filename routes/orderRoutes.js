const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const { downloadInvoice, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, admin, downloadInvoice);
router.put('/:id/status', protect, admin, updateOrderStatus);


module.exports = router;