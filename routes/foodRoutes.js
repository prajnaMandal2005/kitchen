const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

// GET ALL FOOD
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// GET SINGLE FOOD
router.get("/:id", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.json(food);
});

// ADD FOOD
router.post("/", async (req, res) => {
  const food = await Food.create(req.body);
  res.json(food);
});

// UPDATE FOOD
router.put("/:id", async (req, res) => {
  const updated = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE FOOD
router.delete("/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;