import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Link } from "@mui/material";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import LoginIcon from "@mui/icons-material/Login";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token || "demo-token");
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "customer");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, position: "relative" }}>
        <Box sx={{ position: "absolute", top: "10%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(225,29,72,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", bottom: "10%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(252,165,165,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 450, zIndex: 1 }}>
          <Paper sx={{ p: 5, borderRadius: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h3" sx={{ color: "secondary.main", mb: 1, fontSize: "2.4rem" }}>Welcome Back</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Sign in to continue your culinary journey.</Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Email Address" name="email" type="email" placeholder="guest@example.com" onChange={handleChange} required sx={{ mb: 2.5 }} />
              <TextField fullWidth label="Password" name="password" type="password" placeholder="••••••••" onChange={handleChange} required sx={{ mb: 3 }} />
              <Button type="submit" variant="contained" fullWidth size="large" startIcon={<LoginIcon />} sx={{ py: 1.5, fontSize: "1.05rem" }}>
                Sign In
              </Button>
            </form>

            <Box sx={{ textAlign: "center", mt: 3.5 }}>
              <Link component="button" onClick={() => navigate("/register")} sx={{ color: "primary.main", fontWeight: 500, cursor: "pointer", textDecoration: "none", "&:hover": { color: "primary.light" } }}>
                New here? Create an account
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

export default Login;
