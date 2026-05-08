import { useState } from "react";
import api from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Link, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

function WorkerLogin() {
  const location = useLocation();
  const defaultRole = location.state?.defaultRole || "waiter";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setIsPending(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsPending(false);
    try {
      const res = await api.post("/api/workers/login", form);
      localStorage.setItem("token", res.data.token || "demo-token");
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "manager") navigate("/manager");
      else if (res.data.role === "waiter") navigate("/waiter");
      else if (res.data.role === "chef") navigate("/chef");
      else navigate("/");
    } catch (err) {
      if (err.response?.data?.status === "pending") {
        setIsPending(true);
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative" }}>
        <Box sx={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", bottom: "10%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 450, zIndex: 1 }}>
          <Paper sx={{ p: 5, borderRadius: 6, borderTop: "6px solid", borderTopColor: "secondary.main" }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h3" sx={{ color: "secondary.main", mb: 1, fontSize: "2.4rem", fontFamily: "'Playfair Display', serif" }}>Staff Portal</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Secure access for restaurant personnel.</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email Address" name="email" type="email" placeholder="staff@restaurant.com" onChange={handleChange} required sx={{ mb: 2.5 }} />
              <TextField fullWidth label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required sx={{ mb: 3 }} />
              
              {error && (
                <Box sx={{ mb: 3, p: 2, bgcolor: isPending ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)", borderRadius: 3, border: "1px solid", borderColor: isPending ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  {isPending ? <HourglassTopIcon sx={{ color: "warning.main", mt: 0.3 }} /> : <ErrorIcon sx={{ color: "#ef4444", mt: 0.3 }} />}
                  <Typography variant="body2" sx={{ color: isPending ? "warning.main" : "#ef4444", fontWeight: 500 }}>
                    {error}
                  </Typography>
                </Box>
              )}

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />} sx={{ py: 1.5, fontSize: "1.05rem" }}>
                {loading ? "Authenticating..." : "Access Dashboard"}
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 3.5 }}>
              <Link component="button" onClick={() => navigate("/worker-register", { state: { defaultRole } })} sx={{ color: "primary.main", fontWeight: 500, cursor: "pointer", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                New personnel? Apply for a position
              </Link>
              <Typography variant="body2" onClick={() => navigate("/")} sx={{ mt: 2, cursor: "pointer", color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8rem", "&:hover": { color: "text.primary" } }}>
                ← Return to Portal Selection
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </PageTransition>
  );
}

export default WorkerLogin;