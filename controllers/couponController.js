const Coupon = require('../models/Coupon');

// Validate coupon for user
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found or inactive' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (subtotal < coupon.minimumPurchase) {
      return res.status(400).json({ success: false, message: `Minimum purchase ₹${coupon.minimumPurchase} required` });
    }

    if (coupon.isOneTimeUse && coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Coupon already used' });
    }

    const discountAmount = +(subtotal * (coupon.discountPercentage / 100)).toFixed(2);

    res.json({
      success: true,
      data: {
        valid: true,
        coupon: {
          code: coupon.code,
          discountPercentage: coupon.discountPercentage,
          description: coupon.description,
          minimumPurchase: coupon.minimumPurchase
        },
        discountAmount,
        message: 'Coupon applied successfully'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active coupons (user side)
exports.getAvailableCoupons = async (req, res) => {
  try {
    const today = new Date();
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: today } });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create new coupon (admin only)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update coupon (admin only)
exports.updateCoupon = async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Coupon updated', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete coupon (admin only)
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};