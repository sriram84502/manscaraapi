const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin
} = require('../controllers/adminUserController');

// Admin-only routes
router.get('/', protect, admin, getAllUsers);             // GET all users
router.get('/:id', protect, admin, getUserById);          // GET single user
router.put('/:id', protect, admin, updateUserByAdmin);    // UPDATE user
router.delete('/:id', protect, admin, deleteUserByAdmin); // DELETE user

module.exports = router;