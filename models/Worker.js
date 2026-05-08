const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  role: { type: String, enum: ["chef", "waiter", "manager"] },
  password: String,
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Worker", workerSchema);