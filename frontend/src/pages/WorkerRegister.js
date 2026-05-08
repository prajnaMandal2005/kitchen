import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Link, MenuItem, Grid, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import BadgeIcon from "@mui/icons-material/Badge";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";

function WorkerRegister() {
  const location = useLocation();
  const defaultRole = location.state?.defaultRole === "manager" ? "waiter" : (location.state?.defaultRole || "waiter");
  
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Pending
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: defaultRole });
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
      await api.post("/api/workers/send-otp", form);
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/api/workers/verify-otp", { email: form.email, otp });
      setStep(3);
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
      await api.post("/api/workers/resend-otp", { email: form.email });
      setResendTimer(60);
      alert("Verification code resent.");
    } catch (err) {
      setError("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative" }}>
        <Box sx={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 520, zIndex: 1 }}>
          <Paper sx={{ p: 5, borderRadius: 6, borderTop: "6px solid", borderTopColor: "secondary.main" }}>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography variant="h3" sx={{ color: "secondary.main", mb: 1, fontSize: "2.4rem", fontFamily: "'Playfair Display', serif" }}>Staff Onboarding</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Enter your details to apply for a position.</Typography>
                  </Box>

                  <form onSubmit={handleSendOtp}>
                    <TextField fullWidth label="Full Name" name="name" placeholder="Jane Doe" onChange={handleChange} required sx={{ mb: 2.5 }} />
                    <TextField fullWidth label="Email Address" name="email" type="email" placeholder="staff@restaurant.com" onChange={handleChange} required sx={{ mb: 2.5 }} />
                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Phone Number" name="phone" placeholder="(555) 000-0000" onChange={handleChange} required />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth select label="Role" name="role" value={form.role} onChange={handleChange}>
                          <MenuItem value="chef">Chef</MenuItem>
                          <MenuItem value="waiter">Waiter</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <TextField fullWidth label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required sx={{ mb: 3 }} />
                    
                    {error && (
                      <Box sx={{ mb: 2, p: 1.5, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 2, border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", gap: 1 }}>
                        <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "#ef4444" }}>{error}</Typography>
                      </Box>
                    )}

                    <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BadgeIcon />} sx={{ py: 1.5, fontSize: "1.05rem" }}>
                      {loading ? "Sending Code..." : "Verify Email & Apply"}
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <MarkEmailReadIcon sx={{ fontSize: 60, color: "secondary.main", mb: 2 }} />
                    <Typography variant="h4" sx={{ color: "secondary.main", mb: 1, fontSize: "2rem" }}>Verify Identity</Typography>
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
                      {loading ? "Verifying..." : "Verify & Submit Application"}
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
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", py: 2 }}>
                  <HourglassEmptyIcon sx={{ fontSize: 100, color: "warning.main", mb: 3 }} />
                  <Typography variant="h3" sx={{ color: "secondary.main", mb: 2 }}>Application Pending</Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.6 }}>
                    Thank you, <strong style={{ color: "#fff" }}>{form.name}</strong>!<br />
                    Your application for the <strong style={{ color: "primary.main", textTransform: "uppercase" }}>{form.role}</strong> position has been submitted.
                    <br /><br />
                    The Manager will review your details. You will receive an email once your account is activated.
                  </Typography>
                  <Button variant="outlined" fullWidth size="large" onClick={() => navigate("/")} sx={{ py: 1.5 }}>
                    Return to Portal
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {step !== 3 && (
              <Box sx={{ textAlign: "center", mt: 3.5 }}>
                <Link component="button" onClick={() => navigate("/worker-login")} sx={{ color: "primary.main", fontWeight: 500, cursor: "pointer", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                  Already registered? Access Portal
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

export default WorkerRegister;