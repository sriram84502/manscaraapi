const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

// GET all products with filtering, pagination, sorting
router.get('/', productController.getAllProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// CREATE a new product — only admin
router.post('/', protect, admin, productController.createProduct);

// UPDATE a product — only admin
router.put('/:id', protect, admin, productController.updateProduct);

// DELETE a product — only admin
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;