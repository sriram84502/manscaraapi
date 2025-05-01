const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { getAddresses, addAddress, updateAddress, deleteAddress, setPrimaryAddress } = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Address routes
router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/addresses/:id/set-primary', protect, setPrimaryAddress);

module.exports = router;