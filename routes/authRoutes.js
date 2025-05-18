const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Apply limiter to login only
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Please try again later.'
});

router.post('/send-otp', authController.sendPasswordResetOTP);
router.post('/reset-password', authController.resetPasswordWithOTP);
router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/test', (req, res) => {
    res.send('Auth test route working');
  });
  
module.exports = router;
