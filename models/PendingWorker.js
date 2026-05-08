const mongoose = require("mongoose");

const pendingWorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ["chef", "waiter"], required: true },
  password: { type: String, required: true }, // stored hashed
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("PendingWorker", pendingWorkerSchema);
