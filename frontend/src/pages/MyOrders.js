import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Paper, Typography, Button, Container, Chip, Avatar, Skeleton } from "@mui/material";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SoupKitchenIcon from "@mui/icons-material/SoupKitchen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchOrders = useCallback(() => {
    if (userId) {
      api.get(`/api/order/my-orders/${userId}`)
        .then(res => { setOrders(res.data); setLoading(false); })
        .catch(err => { console.log(err); setLoading(false); });
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending": return { label: "Awaiting Chef", color: "warning", icon: <AccessTimeIcon /> };
      case "sent_to_chef": return { label: "Preparing...", color: "info", icon: <SoupKitchenIcon /> };
      case "completed": return { label: "Ready to Serve", color: "success", icon: <CheckCircleIcon /> };
      case "delivered": return { label: "Delivered ✓", color: "default", icon: <DeliveryDiningIcon /> };
      default: return { label: status, color: "default", icon: <RestaurantIcon /> };
    }
  };

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: 4, minHeight: "100vh" }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/dashboard")} sx={{ mb: 3 }}>
          Return to Menu
        </Button>

        <QuoteBanner category="customer" />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h3" sx={{ color: "secondary.main", mb: 0.5, mt: 2, fontSize: { xs: "2rem", md: "2.8rem" } }}>Your Dining Experience</Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>Track the progress of your exquisite selections.</Typography>
        </motion.div>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Paper key={i} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Skeleton variant="rounded" width={130} height={28} animation="wave" />
                <Skeleton variant="text" width={80} height={28} animation="wave" />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Skeleton variant="rounded" width={60} height={60} animation="wave" />
                <Box sx={{ flex: 1 }}><Skeleton variant="text" width="60%" animation="wave" /><Skeleton variant="text" width="30%" animation="wave" /></Box>
              </Box>
            </Paper>
          ))
        ) : orders.length === 0 ? (
          <Paper sx={{ textAlign: "center", py: 8, borderRadius: 4 }}>
            <RestaurantIcon sx={{ fontSize: 60, color: "text.secondary", opacity: 0.4, mb: 2 }} />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>You have no recent orders. Treat yourself to something special.</Typography>
          </Paper>
        ) : (
          orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, pb: 2, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 1 }}>
                    <Box>
                      <Chip icon={statusConfig.icon} label={statusConfig.label} color={statusConfig.color} size="small" sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {new Date(order.createdAt).toLocaleString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif" }}>${order.totalAmount?.toFixed(2)}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {order.items.map((item, i) => (
                      <Paper key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(26,16,21,0.4)", flex: "1 1 240px" }}>
                        <Avatar variant="rounded" src={item.image} sx={{ width: 50, height: 50 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                          <Typography variant="body2" sx={{ color: "secondary.main", fontSize: "0.85rem" }}>Qty: {item.quantity}</Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            );
          })
        )}
      </Container>
    </PageTransition>
  );
}

export default MyOrders;