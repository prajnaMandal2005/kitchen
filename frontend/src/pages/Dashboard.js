import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardMedia, CardContent, CardActions, Box, Chip } from "@mui/material";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import SkeletonLoader from "../components/SkeletonLoader";
import { 
  Logout as LogoutIcon, 
  ReceiptLong as ReceiptLongIcon, 
  ShoppingCartCheckout as ShoppingCartCheckoutIcon, 
  CheckCircle as CheckCircleIcon, 
  AddShoppingCart as AddShoppingCartIcon 
} from "@mui/icons-material";
import PremiumButton from "../components/PremiumButton";

function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/food")
      .then(res => { setMenu(res.data); setLoading(false); })
      .catch(err => { console.log(err); setLoading(false); });
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(selected));
  }, [selected]);

  const toggle = (e, item) => {
    e.stopPropagation();
    if (selected.includes(item._id)) setSelected(selected.filter(id => id !== item._id));
    else setSelected([...selected, item._id]);
  };

  const handleNext = () => {
    if (selected.length === 0) { alert("Please select at least one delicious item before proceeding."); return; }
    const selectedItems = menu.filter(item => selected.includes(item._id));
    navigate("/order", { state: { items: selectedItems } });
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh" }}>
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
            <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", color: "secondary.main" }}>
              Prajna's Kitchen
            </Typography>
            <Button variant="outlined" startIcon={<ReceiptLongIcon />} onClick={() => navigate("/my-orders")} sx={{ mr: 1.5 }}>
              My Orders
            </Button>
            <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <QuoteBanner category="customer" />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 4, pb: 2, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 2 }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Typography variant="h3" sx={{ color: "secondary.main", fontSize: { xs: "2rem", md: "2.8rem" }, mb: 0.5 }}>Culinary Selections</Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>Curated with passion. Prepare to indulge.</Typography>
            </motion.div>
            <PremiumButton variant="contained" size="large" startIcon={<ShoppingCartCheckoutIcon />} onClick={handleNext} disabled={selected.length === 0} sx={{ py: 1.5, px: 4 }}>
              {selected.length > 0 ? `Review Order (${selected.length})` : "Select an Item"}
            </PremiumButton>
          </Box>

          <Grid container spacing={3}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}><SkeletonLoader type="card" /></Grid>
              ))
            ) : (
              menu.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card
                      onClick={() => navigate(`/food/${item._id}`)}
                      sx={{
                        cursor: "pointer",
                        overflow: "hidden",
                        border: selected.includes(item._id) ? "2px solid" : "1px solid",
                        borderColor: selected.includes(item._id) ? "primary.main" : "divider",
                        boxShadow: selected.includes(item._id) ? "0 0 0 1px #e11d48, 0 20px 40px rgba(0,0,0,0.4)" : undefined,
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden", height: 280 }}>
                        <CardMedia
                          component="img"
                          image={item.img}
                          alt={item.name}
                          sx={{
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                        />
                        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(26,16,21,0.95), transparent)", pointerEvents: "none" }} />
                        <Chip
                          label={`$${item.price?.toFixed(2) || "10.00"}`}
                          sx={{
                            position: "absolute", top: 16, right: 16,
                            fontWeight: 700, fontSize: "1rem",
                            bgcolor: "rgba(26,16,21,0.8)", color: "secondary.main",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(252,165,165,0.3)",
                          }}
                        />
                      </Box>
                      <CardContent sx={{ position: "relative", mt: -6, zIndex: 2, pb: 1 }}>
                        <Typography variant="h5" sx={{ mb: 0.5, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {item.details || "A delightful dish prepared with the finest ingredients."}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <PremiumButton
                          fullWidth
                          variant={selected.includes(item._id) ? "outlined" : "contained"}
                          startIcon={selected.includes(item._id) ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
                          onClick={(e) => toggle(e, item)}
                          color={selected.includes(item._id) ? "success" : "primary"}
                        >
                          {selected.includes(item._id) ? "Selected ✓" : "Add to Order"}
                        </PremiumButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default Dashboard;