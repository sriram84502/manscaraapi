const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load config
dotenv.config();

// Init app
const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://manscara.lovabel.com','https://preview--mascara-admin-console-54.lovable.app','https://manscara-glow-landing.lovable.app','https://preview--manscara-glow-landing.lovable.app','http://localhost:8080','https://preview--mascara-admin-console.lovable.app','https://v0-admin-panel-with-user-insights.vercel.app','https://manscara-admin-control-hub.lovable.app'],
  credentials: true
}));
const helmet = require('helmet');
app.use(helmet());

// Connect DB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
  app.get('/', (req, res) => {
    res.send('Server is working!');
  });
    
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes'));
// Add other route files similarly

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
