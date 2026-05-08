const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  img: String,
  ingredients: String,
  details: String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);