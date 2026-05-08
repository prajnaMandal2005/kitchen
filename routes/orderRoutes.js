const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// PLACE ORDER (Customer)
router.post("/place-order", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET MY ORDERS (Customer)
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PENDING ORDERS (Waiter)
router.get("/pending", async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS SENT TO CHEF (Chef)
router.get("/sent-to-chef", async (req, res) => {
  try {
    const orders = await Order.find({ status: "sent_to_chef" }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET COMPLETED ORDERS (Waiter)
router.get("/completed", async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET DELIVERED ORDERS (Waiter/Manager)
router.get("/delivered", async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" }).sort({ createdAt: -1 }).limit(20);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE STATUS (Waiter/Chef/Manager)
router.put("/status/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: 'after' }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;