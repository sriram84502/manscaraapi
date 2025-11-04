const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// GET cart - no auth required for guest carts
router.get('/', cartController.getCart);

// POST add to cart - no auth required for guest carts
router.post('/items', cartController.addToCart);

// PUT update cart item - no auth required for guest carts
router.put('/items/:productId', cartController.updateCartItem);

// DELETE remove from cart - no auth required for guest carts
router.delete('/items/:productId', cartController.removeFromCart);

// DELETE clear cart - no auth required for guest carts
router.delete('/', cartController.clearCart);

// Protected routes for authenticated users
router.get('/user', protect, cartController.getUserCart);
router.post('/user/items', protect, cartController.addUserToCart);
router.put('/user/items/:productId', protect, cartController.updateUserCartItem);
router.delete('/user/items/:productId', protect, cartController.removeUserFromCart);
router.delete('/user', protect, cartController.clearUserCart);

module.exports = router;