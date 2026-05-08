const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTPEmail } = require("../utils/emailService");

// STEP 1: SEND OTP (Customer Registration)
exports.sendOTP = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP with registration data
    await OTP.create({
      email,
      otp,
      name,
      username: username.toLowerCase(),
      password: hashedPassword,
      type: "customer"
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.json({ message: "Verification code sent to your email", email });

  } catch (err) {
    console.error("sendOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: VERIFY OTP & REGISTER
exports.verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, type: "customer" });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Create user with stored data
    const newUser = await User.create({
      name: otpRecord.name,
      username: otpRecord.username,
      email: otpRecord.email,
      password: otpRecord.password,
      role: "customer",
      isVerified: true
    });

    // Delete used OTP
    await OTP.deleteMany({ email });

    res.json({
      message: "Registration successful! Please log in.",
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      role: newUser.role
    });

  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// RESEND OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find existing OTP record to get stored data
    const existingOTP = await OTP.findOne({ email, type: "customer" });

    if (!existingOTP) {
      return res.status(400).json({ message: "No pending registration found. Please start over." });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update existing record with new OTP and reset timer
    existingOTP.otp = otp;
    existingOTP.createdAt = new Date();
    await existingOTP.save();

    // Send new OTP email
    await sendOTPEmail(email, otp, existingOTP.name);

    res.json({ message: "New verification code sent to your email" });

  } catch (err) {
    console.error("resendOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN (unchanged — uses email + password)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login success",
      name: user.name,
      username: user.username,
      _id: user._id,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHECK USERNAME AVAILABILITY
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const exists = await User.findOne({ username: username.toLowerCase() });
    res.json({ available: !exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};