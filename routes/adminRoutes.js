const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/overview', protect, admin, getDashboardStats);

module.exports = router;