const Product = require('../models/Product');

// @desc Get all products with filter, search, pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, skinType, query } = req.query;

    // Dynamic filter
    let filter = {};
    if (skinType) {
      const types = Array.isArray(skinType) ? skinType : skinType.split(',');
      filter.skinType = { $in: types };
    }
    if (query) {
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') }
      ];
    }

    // Sorting logic
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;

    // Fetch products
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created',
      data: product
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product updated', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};