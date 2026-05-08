const express = require("express");
const router = express.Router();
const Worker = require("../models/Worker");
const { 
  sendWorkerOTP, 
  verifyWorkerOTPAndSubmit, 
  resendWorkerOTP, 
  getPendingWorkers, 
  approveWorker, 
  rejectWorker, 
  loginWorker 
} = require("../controllers/workerController");

// --- OTP & REGISTRATION FLOW ---
router.post("/send-otp", sendWorkerOTP);
router.post("/verify-otp", verifyWorkerOTPAndSubmit);
router.post("/resend-otp", resendWorkerOTP);

// --- MANAGER APPROVAL ACTIONS ---
router.get("/pending", getPendingWorkers);
router.post("/approve/:id", approveWorker);
router.post("/reject/:id", rejectWorker);

// --- AUTH ---
router.post("/login", loginWorker);

// --- WORKER CRUD (Existing) ---
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, role, phone } = req.body;
    const updated = await Worker.findByIdAndUpdate(
      req.params.id,
      { name, role, phone },
      { new: true }
    ).select("-password");
    if (!updated) return res.status(404).json({ message: "Worker not found" });
    res.json({ message: "Worker updated successfully", worker: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Worker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Worker not found" });
    res.json({ message: "Worker deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;