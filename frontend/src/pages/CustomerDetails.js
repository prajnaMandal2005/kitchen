import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function CustomerDetails() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/auth/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "secondary.main", mb: 3 }}>Patron Registry</Typography>

      {users.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <PersonIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.4, mb: 1 }} />
          <Typography sx={{ color: "text.secondary" }}>No customers found.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {users.map((u, idx) => (
            <motion.div key={u._id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}>
              <Paper sx={{ display: "flex", alignItems: "center", p: 2, borderRadius: 3, bgcolor: "rgba(26,16,21,0.4)" }}>
                <Avatar sx={{
                  width: 48, height: 48, mr: 2,
                  background: "linear-gradient(135deg, #e11d48, #f97316)",
                  fontWeight: 700, fontSize: "1.3rem",
                  boxShadow: "0 4px 12px rgba(225,29,72,0.3)",
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>{u.email}</Typography>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CustomerDetails;