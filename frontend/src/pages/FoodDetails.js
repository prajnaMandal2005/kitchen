import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import {
  Box, Typography, Button, Container,
  Skeleton, Grid, IconButton, Stack, useTheme
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DoneIcon from "@mui/icons-material/Done";

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(() =>
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );

  const isSelected = selected.includes(id);

  const toggleSelection = () => {
    const newSelected = isSelected
      ? selected.filter(sid => sid !== id)
      : [...selected, id];
    setSelected(newSelected);
    localStorage.setItem("wishlist", JSON.stringify(newSelected));
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/food/${id}`)
      .then(res => setFood(res.data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      bgcolor: "background.default",
      py: { xs: 4, md: 0 } // Extra padding only on mobile
    }}>
      <Container maxWidth="lg">
        {/* Compact Navigation */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 30,
            left: { xs: 20, md: 40 },
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Grid container spacing={4} alignItems="center">

          {/* LEFT SIDE: Content (Animations Staggered) */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Stack spacing={2}>
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 3, fontWeight: 700 }}>
                  Chef's Special Selection
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 1, fontSize: { xs: '2.5rem', md: '3.8rem' } }}>
                  {food.name}
                </Typography>
                <Typography variant="h4" color="secondary" sx={{ fontWeight: 300 }}>
                  ${food.price?.toFixed(2) || "0.00"}
                </Typography>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                    The Ingredients
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: "450px" }}>
                    {food.ingredients || "A proprietary blend of the freshest seasonal ingredients sourced locally."}
                  </Typography>
                </Box>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                    Chef's Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", borderLeft: "2px solid", borderColor: "primary.main", pl: 2 }}>
                    "{food.details || "Prepared with passion and served with elegance."}"
                  </Typography>
                </Box>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Box sx={{ pt: 3 }}>
                  <Button
                    variant={isSelected ? "outlined" : "contained"}
                    size="large"
                    color={isSelected ? "success" : "primary"}
                    startIcon={isSelected ? <DoneIcon /> : <AddShoppingCartIcon />}
                    onClick={toggleSelection}
                    sx={{
                      py: 1.5, px: 6,
                      borderRadius: 10,
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: isSelected ? 0 : theme.shadows[4]
                    }}
                  >
                    {isSelected ? "Saved to Selection" : "Add to Selection"}
                  </Button>
                </Box>
              </motion.div>
            </Stack>
          </Grid>

          {/* RIGHT SIDE: Compact Circular Image */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ width: "100%", maxWidth: "420px" }}
              >
                {/* Visual "Plate" background effect */}
                <Box sx={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  border: "1px dashed",
                  borderColor: "divider",
                  zIndex: 0,
                  animation: "spin 20s linear infinite",
                  "@keyframes spin": { from: { rotate: "0deg" }, to: { rotate: "360deg" } }
                }} />

                <Box
                  component="img"
                  src={food.img}
                  alt={food.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "1/1",
                    borderRadius: "50%", // Circular image fits more content on screen
                    objectFit: "cover",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                    position: "relative",
                    zIndex: 1,
                    border: "8px solid white"
                  }}
                />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const LoadingSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 10 }}>
    <Grid container spacing={6} alignItems="center">
      <Grid item xs={12} md={6}><Skeleton width="40%" height={30} /><Skeleton width="90%" height={100} /><Skeleton width="60%" height={60} /></Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}><Skeleton variant="circular" width={400} height={400} /></Grid>
    </Grid>
  </Container>
);

export default FoodDetails;
