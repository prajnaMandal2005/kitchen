import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Box, Typography, TextField, Button, Grid, Paper, Chip, MenuItem, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

function WorkerDetails() {
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", phone: "", role: "chef", password: "" });
  const API_URL = "/workers/";

  const fetchWorkers = async () => {
    try { const res = await api.get(API_URL); setWorkers(res.data); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await api.post(API_URL, newWorker); setNewWorker({ name: "", email: "", phone: "", role: "chef", password: "" }); fetchWorkers(); }
    catch (err) { alert(err.response?.data?.message || "Error creating worker"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this worker?")) return;
    try { await api.delete(`${API_URL}/${id}`); fetchWorkers(); }
    catch (err) { alert("Delete failed"); }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "chef": return "warning";
      case "waiter": return "info";
      case "manager": return "success";
      default: return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "secondary.main", mb: 3 }}>Personnel Management</Typography>

      <Box component="form" onSubmit={handleCreate} sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: "rgba(26,16,21,0.4)", border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" value={newWorker.name} onChange={e => setNewWorker({ ...newWorker, name: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" type="email" value={newWorker.email} onChange={e => setNewWorker({ ...newWorker, email: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Phone" value={newWorker.phone} onChange={e => setNewWorker({ ...newWorker, phone: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Password" type="password" value={newWorker.password} onChange={e => setNewWorker({ ...newWorker, password: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth select label="Role" value={newWorker.role} onChange={e => setNewWorker({ ...newWorker, role: e.target.value })}>
              <MenuItem value="chef">Chef</MenuItem>
              <MenuItem value="waiter">Waiter</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth startIcon={<PersonAddIcon />} sx={{ py: 1.3 }}>
              Create Worker
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {workers.map((worker, idx) => (
          <motion.div key={worker._id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}>
            <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderRadius: 3, bgcolor: "rgba(26,16,21,0.4)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                  {worker.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{worker.name}</Typography>
                    <Chip label={worker.role} color={getRoleColor(worker.role)} size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{worker.email} • {worker.phone}</Typography>
                </Box>
              </Box>
              <Button variant="outlined" color="error" size="small" startIcon={<DeleteOutlineIcon />} onClick={() => handleDelete(worker._id)}>
                Remove
              </Button>
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

export default WorkerDetails;