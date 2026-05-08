import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Link, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

function Register() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Success
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/send-otp", form);
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/verify-otp", { email: form.email, otp });
      setStep(3);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/resend-otp", { email: form.email });
      setResendTimer(60);
      alert("A new verification code has been sent to your email.");
    } catch (err) {
      setError("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative", overflow: "hidden" }}>
        {/* Animated Background Elements */}
        <Box sx={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <Box sx={{ position: "absolute", bottom: "20%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(252,165,165,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 480, zIndex: 1 }}>
          <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 6, position: "relative", overflow: "hidden" }}>
            
            {/* Step Indicator */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
              {[1, 2, 3].map((s) => (
                <Box key={s} sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: step >= s ? "primary.main" : "rgba(255,255,255,0.1)", transition: "0.4s" }} />
              ))}
            </Box>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h3" sx={{ color: "secondary.main", mb: 1, fontSize: "2.4rem", fontFamily: "'Playfair Display', serif" }}>Join Us</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Create your account to begin your culinary journey.</Typography>
                  </Box>

                  <form onSubmit={handleSendOtp}>
                    <TextField fullWidth label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required sx={{ mb: 2.5 }} />
                    <TextField 
                      fullWidth 
                      label="Username" 
                      name="username" 
                      placeholder="johndoe_123" 
                      value={form.username} 
                      onChange={handleChange} 
                      required 
                      sx={{ mb: 2.5 }}
                      helperText="Username must be unique"
                    />
                    <TextField fullWidth label="Email Address" name="email" type="email" placeholder="guest@example.com" value={form.email} onChange={handleChange} required sx={{ mb: 2.5 }} />
                    <TextField fullWidth label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required sx={{ mb: 3 }} />
                    
                    {error && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, p: 1.5, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 2, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                        <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "#ef4444" }}>{error}</Typography>
                      </Box>
                    )}

                    <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />} sx={{ py: 1.5, fontSize: "1.05rem" }}>
                      {loading ? "Sending Code..." : "Register Now"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <MarkEmailReadIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                    <Typography variant="h4" sx={{ color: "secondary.main", mb: 1, fontSize: "2rem" }}>Verify Email</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      A 6-digit verification code has been sent to <br />
                      <strong style={{ color: "#fff" }}>{form.email}</strong>
                    </Typography>
                  </Box>

                  <form onSubmit={handleVerifyOtp}>
                    <TextField 
                      fullWidth 
                      label="6-Digit Code" 
                      placeholder="000000" 
                      value={otp} 
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(""); }} 
                      required 
                      sx={{ mb: 3, "& input": { textAlign: "center", letterSpacing: "0.5em", fontSize: "1.5rem", fontWeight: 700 } }} 
                    />
                    
                    {error && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, p: 1.5, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 2, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                        <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "#ef4444" }}>{error}</Typography>
                      </Box>
                    )}

                    <Button type="submit" variant="contained" fullWidth size="large" disabled={loading || otp.length < 6} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VpnKeyIcon />} sx={{ py: 1.5, fontSize: "1.05rem", mb: 2 }}>
                      {loading ? "Verifying..." : "Verify & Complete"}
                    </Button>

                    <Box sx={{ textAlign: "center" }}>
                      <Button 
                        variant="text" 
                        onClick={handleResendOtp} 
                        disabled={resendTimer > 0 || loading}
                        sx={{ color: resendTimer > 0 ? "text.disabled" : "primary.main" }}
                      >
                        {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : "Resend Verification Code"}
                      </Button>
                    </Box>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 100, color: "success.main", mb: 3 }} />
                  <Typography variant="h3" sx={{ color: "secondary.main", mb: 2 }}>Welcome!</Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
                    Your account has been created successfully. <br />
                    Redirecting you to the login page...
                  </Typography>
                  <CircularProgress color="primary" />
                </motion.div>
              )}
            </AnimatePresence>

            {step !== 3 && (
              <Box sx={{ textAlign: "center", mt: 3.5 }}>
                <Link component="button" onClick={() => navigate("/login")} sx={{ color: "primary.main", fontWeight: 500, cursor: "pointer", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                  Already have an account? Sign In
                </Link>
                <Typography variant="body2" onClick={() => navigate("/")} sx={{ mt: 2, cursor: "pointer", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8rem", "&:hover": { color: "text.primary" } }}>
                  ← Return to Portal Selection
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>
    </PageTransition>
  );
}

export default Register;
