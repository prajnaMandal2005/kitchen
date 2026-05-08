const Worker = require("../models/Worker");
const OTP = require("../models/OTP");
const PendingWorker = require("../models/PendingWorker");
const bcrypt = require("bcryptjs");
const { generateOTP, sendOTPEmail, sendWorkerRequestNotification, sendWorkerDecisionEmail } = require("../utils/emailService");

// STEP 1: SEND WORKER OTP
exports.sendWorkerOTP = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Block manager role registration
    if (role === "manager") {
      return res.status(403).json({ message: "Manager registration is not allowed. Only one manager exists." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists in Worker or PendingWorker
    const workerExists = await Worker.findOne({ email });
    if (workerExists) {
      return res.status(400).json({ message: "This email is already registered as staff" });
    }

    const pendingExists = await PendingWorker.findOne({ email, status: "pending" });
    if (pendingExists) {
      return res.status(400).json({ message: "An application with this email is already pending review" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email, type: "worker" });

    // Store OTP with worker data
    await OTP.create({
      email,
      otp,
      name,
      phone,
      role,
      password: hashedPassword,
      type: "worker"
    });

    // Send OTP email
    await sendOTPEmail(email, otp, name);

    res.json({ message: "Verification code sent to your email", email });

  } catch (err) {
    console.error("sendWorkerOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: VERIFY WORKER OTP & SUBMIT FOR APPROVAL
exports.verifyWorkerOTPAndSubmit = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, type: "worker" });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Create PendingWorker (awaiting manager approval)
    await PendingWorker.create({
      name: otpRecord.name,
      email: otpRecord.email,
      phone: otpRecord.phone,
      role: otpRecord.role,
      password: otpRecord.password,
      status: "pending"
    });

    // Notify manager about the new application
    await sendWorkerRequestNotification({
      name: otpRecord.name,
      email: otpRecord.email,
      phone: otpRecord.phone,
      role: otpRecord.role
    });

    // Delete used OTP
    await OTP.deleteMany({ email, type: "worker" });

    res.json({
      message: "Email verified! Your application has been submitted for manager review. You'll be notified once approved."
    });

  } catch (err) {
    console.error("verifyWorkerOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// RESEND WORKER OTP
exports.resendWorkerOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingOTP = await OTP.findOne({ email, type: "worker" });

    if (!existingOTP) {
      return res.status(400).json({ message: "No pending registration found. Please start over." });
    }

    const otp = generateOTP();
    existingOTP.otp = otp;
    existingOTP.createdAt = new Date();
    await existingOTP.save();

    await sendOTPEmail(email, otp, existingOTP.name);

    res.json({ message: "New verification code sent to your email" });

  } catch (err) {
    console.error("resendWorkerOTP error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET PENDING WORKERS (for Manager)
exports.getPendingWorkers = async (req, res) => {
  try {
    const pending = await PendingWorker.find({ status: "pending" }).select("-password").sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// APPROVE WORKER (Manager action)
exports.approveWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await PendingWorker.findById(id);
    if (!pending) {
      return res.status(404).json({ message: "Pending worker not found" });
    }

    // Create actual Worker account
    await Worker.create({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      role: pending.role,
      password: pending.password,
      isApproved: true
    });

    // Remove from pending
    await PendingWorker.findByIdAndDelete(id);

    // Notify worker
    await sendWorkerDecisionEmail(pending.email, pending.name, true, pending.role);

    res.json({ message: `${pending.name} has been approved as ${pending.role}!` });

  } catch (err) {
    console.error("approveWorker error:", err);
    res.status(500).json({ error: err.message });
  }
};

// REJECT WORKER (Manager action)
exports.rejectWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const pending = await PendingWorker.findById(id);
    if (!pending) {
      return res.status(404).json({ message: "Pending worker not found" });
    }

    // Remove from pending
    await PendingWorker.findByIdAndDelete(id);

    // Notify worker
    await sendWorkerDecisionEmail(pending.email, pending.name, false, pending.role);

    res.json({ message: `${pending.name}'s application has been rejected.` });

  } catch (err) {
    console.error("rejectWorker error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN WORKER (with approval check)
exports.loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });
    if (!worker) {
      // Check if they're pending
      const pending = await PendingWorker.findOne({ email, status: "pending" });
      if (pending) {
        return res.status(403).json({ 
          message: "Your application is still under review. Please wait for manager approval.",
          status: "pending"
        });
      }
      return res.status(400).json({ message: "Account not found" });
    }

    // Check if approved (manager is always approved)
    if (!worker.isApproved && worker.role !== "manager") {
      return res.status(403).json({ 
        message: "Your account is pending manager approval.",
        status: "pending"
      });
    }

    const match = await bcrypt.compare(password, worker.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({
      message: "Login success",
      name: worker.name,
      _id: worker._id,
      role: worker.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REGISTER WORKER (legacy — kept for backward compat but blocks manager)
exports.registerWorker = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (role === "manager") {
      return res.status(403).json({ message: "Manager registration is not allowed" });
    }

    const exist = await Worker.findOne({ email });
    if (exist) return res.status(400).json({ message: "Worker exists" });

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6+ chars" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newWorker = await Worker.create({
      name, email, phone, role,
      password: hashed,
      isApproved: false
    });

    res.json({ message: "Worker registered — pending approval", _id: newWorker._id, name: newWorker.name, role: newWorker.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};