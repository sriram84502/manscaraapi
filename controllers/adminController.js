const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        monthlySales,
        totalUsers
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};