const mongoose = require("mongoose");

const completedOrderSchema = new mongoose.Schema({
  customerName: String,
  items: [String],
  message: String
});

module.exports = mongoose.model("CompletedOrder", completedOrderSchema);