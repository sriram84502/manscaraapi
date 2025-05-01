const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify Razorpay signature
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};