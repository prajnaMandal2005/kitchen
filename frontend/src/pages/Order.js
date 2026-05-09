import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Box, Paper, Typography, Button, Container, Avatar, IconButton, Divider } from "@mui/material";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import { 
  ArrowBack as ArrowBackIcon, 
  Add as AddIcon, 
  Remove as RemoveIcon, 
  DeleteOutlined as DeleteOutlineIcon, 
  Celebration as CelebrationIcon, 
  TrackChanges as TrackChangesIcon, 
  MenuBook as MenuBookIcon, 
  Send as SendIcon 
} from "@mui/icons-material";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialItems = location.state?.items?.map(item => ({ ...item, quantity: 1 })) || [];
  const [cart, setCart] = useState(initialItems);

  const name = localStorage.getItem("name");
  const userId = localStorage.getItem("userId");

  const handleQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) { const q = item.quantity + delta; return { ...item, quantity: q > 0 ? q : 1 }; }
      return item;
    }));
  };

  const handleRemove = (id) => setCart(cart.filter(item => item._id !== id));

  const getTotal = () => cart.reduce((acc, curr) => acc + (curr.price || 10) * curr.quantity, 0).toFixed(2);

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    setLoading(true);
    const orderPayload = {
      userId, customerName: name,
      items: cart.map(item => ({ name: item.name, price: item.price || 10, quantity: item.quantity, image: item.img })),
      totalAmount: parseFloat(getTotal())
    };
    api.post("/order/place-order", orderPayload)
      .then(() => { 
        setPlaced(true); 
        setLoading(false); 
        localStorage.removeItem("wishlist");
      })
      .catch(err => { console.error("Order failed:", err); setLoading(false); });
  };

  if (placed) {
    return (
      <PageTransition>
        <Container maxWidth="sm" sx={{ py: 6, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <QuoteBanner category="customer" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={{ width: "100%" }}>
            <Paper sx={{ p: 5, borderRadius: 4, textAlign: "center" }}>
              <motion.div animate={{ rotate: [0, 15, -15, 10, -10, 0] }} transition={{ duration: 1, delay: 0.3 }}>
                <CelebrationIcon sx={{ fontSize: 80, color: "secondary.main", mb: 2, filter: "drop-shadow(0 0 20px rgba(252,165,165,0.4))" }} />
              </motion.div>
              <Typography variant="h3" sx={{ color: "secondary.main", mb: 1 }}>Bon Appétit!</Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>Your exquisite meal is being prepared by our master chefs.</Typography>

              <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "rgba(26,16,21,0.5)", textAlign: "left" }}>
                <Typography variant="h6" sx={{ color: "primary.main", mb: 2, pb: 1, borderBottom: "1px solid", borderColor: "divider" }}>Order Summary</Typography>
                {cart.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                    <Avatar variant="rounded" src={item.img} sx={{ width: 60, height: 60 }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{item.quantity} × {item.name}</Typography>
                      <Typography variant="body2" sx={{ color: "warning.main", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.8rem" }}>
                        Preparing...
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                <Button variant="outlined" startIcon={<MenuBookIcon />} onClick={() => navigate("/dashboard")}>Return to Menu</Button>
                <Button variant="contained" startIcon={<TrackChangesIcon />} onClick={() => navigate("/my-orders")}>Track Experience</Button>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: 4, minHeight: "100vh" }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Continue Browsing
        </Button>

        <QuoteBanner category="customer" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mt: 2 }}>
            <Typography variant="h4" sx={{ color: "secondary.main", mb: 0.5 }}>Your Selection</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>Review your choices before we begin preparation.</Typography>

            {cart.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>Your table is empty.</Typography>
              </Box>
            ) : (
              <>
                {cart.map((item, i) => (
                  <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, mb: 2, borderRadius: 3, bgcolor: "rgba(26,16,21,0.4)", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar variant="rounded" src={item.img} sx={{ width: 80, height: 80, boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }} />
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: "1.2rem" }}>{item.name}</Typography>
                          <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 600 }}>${item.price?.toFixed(2) || "10.00"}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Paper sx={{ display: "flex", alignItems: "center", borderRadius: 8, bgcolor: "rgba(0,0,0,0.3)", px: 0.5 }}>
                          <IconButton size="small" onClick={() => handleQuantity(item._id, -1)} sx={{ color: "text.primary" }}><RemoveIcon /></IconButton>
                          <Typography sx={{ mx: 1.5, fontWeight: 500, fontSize: "1.1rem" }}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => handleQuantity(item._id, 1)} sx={{ color: "text.primary" }}><AddIcon /></IconButton>
                        </Paper>
                        <IconButton onClick={() => handleRemove(item._id)} sx={{ color: "error.main" }}><DeleteOutlineIcon /></IconButton>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Total Amount</Typography>
                    <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif" }}>${getTotal()}</Typography>
                  </Box>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="contained" size="large" endIcon={<SendIcon />} onClick={handleConfirmOrder} disabled={loading} sx={{ py: 1.5, px: 5, fontSize: "1.1rem" }}>
                      {loading ? "Transmitting..." : "Confirm Order"}
                    </Button>
                  </motion.div>
                </Box>
              </>
            )}
          </Paper>
        </motion.div>
      </Container>
    </PageTransition>
  );
}

export default Order;
