import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, Avatar, Paper } from "@mui/material";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import SkeletonLoader from "../components/SkeletonLoader";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    api.get("/order/sent-to-chef")
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id) => {
    try { await api.put(`/order/status/${id}`, { status: "completed" }); fetchOrders(); }
    catch (err) { console.log(err); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", color: "secondary.main" }}>
              👨‍🍳 Kitchen Command
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!loading && orders.length > 0 && (
                <Chip icon={<LocalFireDepartmentIcon />} label={`${orders.length} Active`} color="error" size="small" />
              )}
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>End Shift</Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <QuoteBanner category="chef" />

          {loading ? (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}><SkeletonLoader type="card" /></Grid>
              ))}
            </Grid>
          ) : orders.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <Paper sx={{ textAlign: "center", py: 8, px: 4, borderRadius: 4, mt: 3 }}>
                <AutoAwesomeIcon sx={{ fontSize: 70, color: "text.secondary", opacity: 0.4, mb: 2 }} />
                <Typography variant="h4" sx={{ color: "text.secondary", mb: 0.5 }}>The Kitchen is Clear</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>Awaiting new culinary requests.</Typography>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {orders.map((order, idx) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }}>
                    <Card sx={{ borderTop: "4px solid", borderTopColor: "primary.main", height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px dashed", borderColor: "divider" }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ticket For</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{order.customerName}</Typography>
                          </Box>
                          <Chip icon={<LocalFireDepartmentIcon />} label="Cooking" color="error" size="small" />
                        </Box>

                        {order.items.map((item, i) => (
                          <Paper key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, mb: 1, borderRadius: 2, bgcolor: "rgba(0,0,0,0.3)" }}>
                            <Avatar variant="rounded" src={item.image} sx={{ width: 50, height: 50 }} />
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                <Box component="span" sx={{ color: "secondary.main", fontWeight: 700, mr: 0.5 }}>{item.quantity}x</Box>
                                {item.name}
                              </Typography>
                            </Box>
                          </Paper>
                        ))}
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0 }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button fullWidth variant="contained" color="success" size="large" startIcon={<CheckCircleIcon />} onClick={() => handleComplete(order._id)} sx={{ py: 1.3 }}>
                            Mark Complete
                          </Button>
                        </motion.div>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </PageTransition>
  );
}

export default ChefDashboard;
