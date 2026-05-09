import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, Avatar, Paper, Divider } from "@mui/material";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  Logout as LogoutIcon,
  Send as SendIcon,
  RoomService as RoomServiceIcon,
  HourglassEmpty as HourglassEmptyIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon
} from "@mui/icons-material";

function WaiterDashboard() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    Promise.all([
      api.get("/order/pending"),
      api.get("/order/completed"),
      api.get("/order/delivered")
    ]).then(([pendingRes, completedRes, deliveredRes]) => {
      setPendingOrders(Array.isArray(pendingRes.data) ? pendingRes.data : []);
      setCompletedOrders(Array.isArray(completedRes.data) ? completedRes.data : []);
      setDeliveredOrders(Array.isArray(deliveredRes.data) ? deliveredRes.data : []);
      setLoading(false);
    }).catch(err => { 
      console.error("Waiter fetch error:", err); 
      setLoading(false);
      setPendingOrders([]);
      setCompletedOrders([]);
      setDeliveredOrders([]);
    });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try { await api.put(`/order/status/${id}`, { status }); fetchOrders(); }
    catch (err) { console.log(err); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", color: "primary.main" }}>
              🍷 Waiter Portal
            </Typography>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>End Shift</Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <QuoteBanner category="waiter" />

          <Grid container spacing={4} sx={{ mt: 1, width: "100%", ml: 0 }}>
            {/* PENDING ORDERS */}
            <Grid item xs={12} md={6} sx={{ pl: "0 !important" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Typography variant="h4" sx={{ fontSize: "1.8rem" }}>Incoming Requests</Typography>
                {!loading && pendingOrders.length > 0 && (
                  <Chip icon={<HourglassEmptyIcon />} label={pendingOrders.length} color="warning" size="small" />
                )}
              </Box>

              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <SkeletonLoader key={i} type="list" />)
              ) : pendingOrders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                  <Typography sx={{ color: "text.secondary" }}>All tables are quiet.</Typography>
                </Paper>
              ) : (
                pendingOrders.map((order, idx) => (
                  <motion.div key={order._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card sx={{ mb: 2, borderLeft: "4px solid", borderLeftColor: "warning.main" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guest</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{order.customerName}</Typography>
                          </Box>
                          <Chip icon={<HourglassEmptyIcon />} label="Awaiting" color="warning" size="small" />
                        </Box>

                        {order.items.map((item, i) => (
                          <Paper key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, mb: 1, borderRadius: 2, bgcolor: "rgba(0,0,0,0.25)" }}>
                            <Avatar variant="rounded" src={item.image} sx={{ width: 40, height: 40 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.quantity}x {item.name}</Typography>
                          </Paper>
                        ))}

                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button fullWidth variant="contained" endIcon={<SendIcon />} onClick={() => updateStatus(order._id, "sent_to_chef")} sx={{ mt: 2 }}>
                            Send to Chef
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </Grid>

            {/* COMPLETED ORDERS */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Typography variant="h4" sx={{ fontSize: "1.8rem", color: "success.main" }}>Ready for Service</Typography>
                {!loading && completedOrders.length > 0 && (
                  <Chip icon={<CheckCircleOutlineIcon />} label={completedOrders.length} color="success" size="small" />
                )}
              </Box>

              {loading ? (
                Array.from({ length: 2 }).map((_, i) => <SkeletonLoader key={i} type="list" />)
              ) : completedOrders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                  <Typography sx={{ color: "text.secondary" }}>No dishes waiting.</Typography>
                </Paper>
              ) : (
                completedOrders.map((order, idx) => (
                  <motion.div key={order._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Card sx={{ mb: 2, borderLeft: "4px solid", borderLeftColor: "success.main" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>Guest</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{order.customerName}</Typography>
                          </Box>
                          <Chip icon={<CheckCircleOutlineIcon />} label="Ready" color="success" size="small" />
                        </Box>

                        {order.items.map((item, i) => (
                          <Paper key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1, mb: 1, borderRadius: 2, bgcolor: "rgba(0,0,0,0.25)" }}>
                            <Avatar variant="rounded" src={item.image} sx={{ width: 40, height: 40 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.quantity}x {item.name}</Typography>
                          </Paper>
                        ))}

                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button fullWidth variant="contained" color="success" endIcon={<RoomServiceIcon />} onClick={() => updateStatus(order._id, "delivered")} sx={{ mt: 2 }}>
                            Serve to Guest
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </Grid>

            {/* DELIVERED HISTORY */}
            <Grid item xs={12} md={12} sx={{ width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Typography variant="h4" sx={{ fontSize: "1.8rem", color: "text.secondary" }}>Recently Delivered</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
                {deliveredOrders.map((order, idx) => (
                  <Card key={order._id} sx={{ minWidth: 280, bgcolor: "rgba(0,0,0,0.2)", opacity: 0.8 }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ color: "primary.main" }}>{order.customerName}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
                        Delivered at {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Divider sx={{ mb: 1 }} />
                      {order.items.map((item, i) => (
                        <Typography key={i} variant="caption" sx={{ display: "block" }}>{item.quantity}x {item.name}</Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}
                {!loading && deliveredOrders.length === 0 && (
                  <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>No orders delivered yet today.</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default WaiterDashboard;
