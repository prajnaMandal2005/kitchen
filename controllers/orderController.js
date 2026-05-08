const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { customerName, items } = req.body;

    const order = await Order.create({
      customerName,
      items
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ORDERS (for chef)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};