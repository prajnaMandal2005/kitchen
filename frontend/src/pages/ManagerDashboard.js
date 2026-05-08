import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, AppBar, Toolbar, Typography, Button, Container, Paper, Tabs, Tab, Badge } from "@mui/material";
import api from "../api";
import WorkerDetails from "./WorkerDetails";
import CustomerDetails from "./CustomerDetails";
import FoodManager from "./FoodManager";
import StaffRequests from "./StaffRequests";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

function ManagerDashboard() {
  const [tab, setTab] = useState(-1);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check pending workers count for the badge
    const fetchPendingCount = async () => {
      try {
        const res = await api.get("/api/workers/pending");
        setPendingCount(res.data.length);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const renderView = () => {
    switch (tab) {
      case 0: return <WorkerDetails />;
      case 1: return <CustomerDetails />;
      case 2: return <FoodManager />;
      case 3: return <StaffRequests />;
      default: return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <DashboardIcon sx={{ fontSize: 70, color: "text.secondary", opacity: 0.4, mb: 2 }} />
            <Typography variant="h4" sx={{ color: "secondary.main", mb: 0.5 }}>Select a module</Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>to begin administration.</Typography>
          </Box>
        </motion.div>
      );
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
            <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", color: "success.main" }}>
              🎩 Executive Board
            </Typography>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>Sign Out</Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <QuoteBanner category="manager" />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4, overflowX: "auto", pb: 1 }}>
            <Paper sx={{ borderRadius: 8, overflow: "hidden" }}>
              <Tabs
                value={tab === -1 ? false : tab}
                onChange={(_, newVal) => setTab(newVal)}
                textColor="inherit"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    py: 1.5, px: 3, fontSize: "1rem", fontWeight: 500,
                    color: "text.secondary",
                    minHeight: 64,
                    "&.Mui-selected": { color: "primary.main" },
                  },
                }}
              >
                <Tab icon={<PeopleAltIcon />} label="Personnel" iconPosition="start" />
                <Tab icon={<PersonIcon />} label="Patrons" iconPosition="start" />
                <Tab icon={<RestaurantMenuIcon />} label="Menu Config" iconPosition="start" />
                <Tab 
                  icon={
                    <Badge badgeContent={pendingCount} color="error" overlap="circular">
                      <GroupAddIcon />
                    </Badge>
                  } 
                  label="Staff Requests" 
                  iconPosition="start" 
                />
              </Tabs>
            </Paper>
          </Box>

          <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 6, minHeight: 400, borderTop: "6px solid", borderTopColor: "success.main" }}>
              {renderView()}
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default ManagerDashboard;