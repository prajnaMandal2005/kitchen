const express = require("express");
const { sendOTP, verifyOTPAndRegister, resendOTP, loginUser, checkUsername } = require("../controllers/authController");

const router = express.Router();

const User = require("../models/User");

// OTP Registration Flow
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndRegister);
router.post("/resend-otp", resendOTP);

// Login
router.post("/login", loginUser);

// Check username availability
router.get("/check-username/:username", checkUsername);

// Get all customers
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;