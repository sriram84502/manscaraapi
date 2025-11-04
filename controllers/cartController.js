const Product = require('../models/Product');

// GET /api/cart - for guest users
exports.getCart = async (req, res) => {
  // For guest users, we'll return an empty cart or session-based cart
  // In a production environment, you might use session storage or localStorage
  const guestCart = {
    items: [],
    subtotal: 0,
    itemCount: 0
  };
  res.json({ success: true, data: guestCart });
};

// POST /api/cart/items - for guest users
exports.addToCart = async (req, res) => {
  // For guest users, we'll return a success response
  // The actual cart management will be handled on the frontend
  res.json({ success: true, message: 'Product added to cart' });
};

// PUT /api/cart/items/:productId - for guest users
exports.updateCartItem = async (req, res) => {
  // For guest users, we'll return a success response
  res.json({ success: true, message: 'Cart updated' });
};

// DELETE /api/cart/items/:productId - for guest users
exports.removeFromCart = async (req, res) => {
  // For guest users, we'll return a success response
  res.json({ success: true, message: 'Product removed from cart' });
};

// DELETE /api/cart - for guest users
exports.clearCart = async (req, res) => {
  // For guest users, we'll return a success response
  res.json({ success: true, message: 'Cart cleared' });
};

// GET /api/cart/user - for authenticated users
exports.getUserCart = async (req, res) => {
  res.json({ success: true, data: req.user.cart });
};

// POST /api/cart/user/items - for authenticated users
exports.addUserToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const existing = user.cart.items.find(item => item.productId.equals(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.items.push({
      productId,
      name: product.name,
      subtitle: product.subtitle,
      image: product.images?.[0] || '',
      price: product.discountPrice || product.price,
      quantity
    });
  }

  updateCartSummary(user);
  await user.save();

  res.json({ success: true, message: 'Product added to cart', data: user.cart });
};

// PUT /api/cart/user/items/:productId - for authenticated users
exports.updateUserCartItem = async (req, res) => {
  const { quantity } = req.body;
  const user = req.user;
  const item = user.cart.items.find(item => item.productId.equals(req.params.productId));

  if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

  item.quantity = quantity;
  updateCartSummary(user);
  await user.save();

  res.json({ success: true, message: 'Cart updated', data: user.cart });
};

// DELETE /api/cart/user/items/:productId - for authenticated users
exports.removeUserFromCart = async (req, res) => {
  const user = req.user;
  user.cart.items = user.cart.items.filter(item => !item.productId.equals(req.params.productId));

  updateCartSummary(user);
  await user.save();

  res.json({ success: true, message: 'Product removed from cart', data: user.cart });
};

// DELETE /api/cart/user - for authenticated users
exports.clearUserCart = async (req, res) => {
  const user = req.user;
  user.cart.items = [];
  user.cart.subtotal = 0;
  user.cart.itemCount = 0;

  await user.save();
  res.json({ success: true, message: 'Cart cleared', data: user.cart });
};

// Helper to recalculate subtotal & count
function updateCartSummary(user) {
  const subtotal = user.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = user.cart.items.reduce((count, item) => count + item.quantity, 0);
  user.cart.subtotal = subtotal;
  user.cart.itemCount = itemCount;
}