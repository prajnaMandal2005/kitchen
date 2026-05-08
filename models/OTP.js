const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  // Store registration data temporarily until OTP is verified
  name: { type: String },
  username: { type: String },
  password: { type: String }, // already hashed
  phone: { type: String },
  role: { type: String },
  type: { type: String, enum: ["customer", "worker"], default: "customer" },
  createdAt: { type: Date, default: Date.now, expires: 600 } // auto-delete after 10 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
