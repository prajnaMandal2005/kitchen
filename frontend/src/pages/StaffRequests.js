import { useEffect, useState } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Paper, Avatar, Button, Grid, Chip, Divider, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import RefreshIcon from "@mui/icons-material/Refresh";

function StaffRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/workers/pending");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.post(`/api/workers/${action}/${id}`);
      setRequests(requests.filter(r => r._id !== id));
      alert(`Staff member ${action === "approve" ? "approved" : "rejected"} successfully.`);
    } catch (err) {
      alert("Action failed.");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "secondary.main", mb: 0.5, fontWeight: 700 }}>Staff Applications</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Review and hire new team members.</Typography>
        </Box>
        <IconButton onClick={fetchRequests} sx={{ color: "primary.main" }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {requests.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10, bgcolor: "rgba(255,255,255,0.02)", borderRadius: 6, border: "2px dashed rgba(255,255,255,0.05)" }}>
          <HourglassEmptyIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.3, mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>No pending applications</Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>All staff requests have been processed.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {requests.map((r, idx) => (
              <Grid item xs={12} md={6} key={r._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Paper sx={{ p: 3, borderRadius: 4, position: "relative", bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", "&:hover": { bgcolor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" } }}>
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                      <Avatar sx={{ width: 64, height: 64, bgcolor: "secondary.main", color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
                        {r.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{r.name}</Typography>
                        <Chip 
                          size="small" 
                          label={r.role} 
                          color={r.role === "chef" ? "error" : "primary"} 
                          sx={{ textTransform: "uppercase", fontWeight: 800, fontSize: "0.65rem", height: 20 }} 
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, opacity: 0.5 }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{r.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{r.phone || "No phone provided"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "text.secondary" }}>
                        <BadgeIcon fontSize="small" />
                        <Typography variant="body2">Applied: {new Date(r.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircleIcon />} 
                        onClick={() => handleAction(r._id, "approve")}
                        sx={{ py: 1.2, fontWeight: 700 }}
                      >
                        Approve
                      </Button>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        color="error" 
                        startIcon={<CancelIcon />} 
                        onClick={() => handleAction(r._id, "reject")}
                        sx={{ py: 1.2, fontWeight: 700 }}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}
    </Box>
  );
}

// Inline missing icon
function HourglassEmptyIcon(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

export default StaffRequests;
