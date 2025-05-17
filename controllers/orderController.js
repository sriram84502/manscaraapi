const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const sendEmail = require('../utils/sendEmail');
const generateInvoice = require('../utils/generateInvoice');
const path = require('path');

// Create order after payment
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, saveShippingAddress, couponCode, paymentMethod } = req.body;
    const user = req.user;

    if (!user.cart || user.cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const subtotal = user.cart.subtotal;
    const tax = +(subtotal * 0.18).toFixed(2);
    const shippingCost = subtotal > 100 ? 0 : 20;

    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });

      if (!coupon) {
        return res.status(400).json({ success: false, message: 'Invalid or inactive coupon' });
      }

      if (new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon has expired' });
      }

      if (coupon.isOneTimeUse && coupon.usedBy.includes(user._id)) {
        return res.status(400).json({ success: false, message: 'Coupon already used' });
      }

      if (subtotal < coupon.minimumPurchase) {
        return res.status(400).json({ success: false, message: `Minimum purchase ₹${coupon.minimumPurchase} required` });
      }

      appliedCoupon = coupon;
    }

    const discountAmount = appliedCoupon
      ? +(subtotal * (appliedCoupon.discountPercentage / 100)).toFixed(2)
      : 0;

    const total = +(subtotal + tax + shippingCost - discountAmount).toFixed(2);

    const order = await Order.create({
      user: user._id,
      items: user.cart.items.map(item => ({
        productId: item.productId,
        name: item.name,
        subtitle: item.subtitle,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      discountAmount,
      total,
      couponCode,
      trackingNumber: `TRK${Math.floor(1000000 + Math.random() * 9000000)}`,
      trackingUrl: `https://www.bluedart.com/tracking/${Math.floor(1000000 + Math.random() * 9000000)}`
    });

    if (saveShippingAddress) {
      user.addresses.forEach(addr => (addr.isPrimary = false));
      user.addresses.push({ ...shippingAddress, isPrimary: true });
    }

    user.cart = { items: [], subtotal: 0, itemCount: 0 };
    await user.save();

    if (appliedCoupon && appliedCoupon.isOneTimeUse) {
      appliedCoupon.usedBy.push(user._id);
      await appliedCoupon.save();
    }

    const orderSummary = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #4CAF50;">🛒 Manscara - Order Confirmation</h2>
        <p>Hello <strong>${user.firstName}</strong>,</p>
        <p>Thank you for your purchase! Your order <strong>#${order._id}</strong> has been placed successfully.</p>

        <h3>📦 Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ccc;">Product</th>
              <th style="padding: 8px; border: 1px solid #ccc;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ccc;">${item.name}</td>
                <td style="padding: 8px; border: 1px solid #ccc;">${item.quantity}</td>
                <td style="padding: 8px; border: 1px solid #ccc;">₹${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>💰 Total: ₹${order.total.toFixed(2)}</h3>
        <p><strong>Discount Applied:</strong> ₹${order.discountAmount.toFixed(2)}</p>

        <h3>🚚 Shipping Address:</h3>
        <p>
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
          ${order.shippingAddress.address}, ${order.shippingAddress.city}<br/>
          ${order.shippingAddress.region} - ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}<br/>
          Phone: ${order.shippingAddress.phone}
        </p>

        <h3>📦 Track Your Order:</h3>
        <p>
          Tracking Number: <strong>${order.trackingNumber}</strong><br/>
          <a href="${order.trackingUrl}" style="color: #4CAF50;">Click here to track your order</a>
        </p>

        <hr/>
        <p style="font-size: 14px; color: #888;">Need help? Reply to this email or contact support at support@manscara.com</p>
      </div>
    `;

    try {
      await sendEmail(user.email, 'Your Order Confirmation', orderSummary);
      await sendEmail(process.env.ADMIN_EMAIL, `New Order from ${user.email}`, orderSummary);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all orders of user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.user.equals(req.user._id)) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Download invoice (admin use only)
exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const buffer = await generateInvoice(order, order.user);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice_${order._id}.pdf`,
      'Content-Length': buffer.length
    });

    res.send(buffer);
  } catch (err) {
    console.error('Invoice generation failed:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingUrl } = req.body;
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Shipped' && trackingUrl) {
      order.trackingUrl = trackingUrl;
    }

    await order.save();

    // Format phone number
    const phone = order.shippingAddress.phone.replace(/[^0-9]/g, '');

    // WhatsApp Message
    const message = encodeURIComponent(
      `Hi ${order.shippingAddress.firstName},\n\n` +
      `Thank you for your purchase 🥰 Here are your order details:\n\n` +
      `🧾 *Order ID:* #${order._id}\n\n` +
      `📦 *Products ordered:*\n${order.items.map(item => `${item.name} | ${item.subtitle}`).join('\n')}\n\n` +
      `🚚 *Tracking link:* ${order.trackingUrl || 'N/A'}\n\n` +
      `🕐 *Note:* Your order will be delivered in the next 4–7 working days.\n\n` +
      `🎉 Congratulations on being a part of donating 1 Menstrual Cup to someone in need!\n\n` +
      `✅ At TRU HAIR & SKIN, we handpick natural ingredients tailored just for you.`
    );
    
    const whatsappLink = `https://wa.me/91${phone}?text=${message}`;
    

    res.json({
      success: true,
      message: 'Order status updated',
      data: {
        order,
        whatsappLink
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

  
// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get detailed order by ID (admin only)
exports.getOrderDetailsById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email');
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
