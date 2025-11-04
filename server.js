const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load config
dotenv.config();

// Load Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml');

// Init app
const app = express();

// Configure CORS to allow Swagger UI to access the API
const corsOptions = {
  origin: ['https://manscara-glow-landing.onrender.com','https://preview--manscara-glow-landing-17.lovable.app','https://preview--mascara-admin-console-54.lovable.app','https://manscara-glow-landing.lovable.app','https://preview--manscara-glow-landing.lovable.app','http://localhost:8080','https://preview--mascara-admin-console.lovable.app','https://v0-admin-panel-with-user-insights.vercel.app','https://manscara-admin-control-hub.lovable.app','https://preview--manscara-glow-landing-27667-01290.lovable.app','https://preview--manscara-glow-landing-24.lovable.app','https://preview--manscara-glow-landing-45.lovable.app', 'http://localhost:5050','http://localhost:8081','http://localhost:8080'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
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
  
// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/api-docs/swagger.json'
  }
}));

// Serve the swagger.json file directly
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

app.get('/', (req, res) => {
  res.send('Server is working! API Documentation available at <a href="/api-docs">/api-docs</a>');
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