import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import SkeletonLoader from "../components/SkeletonLoader";
import { AddCircleOutlined as AddCircleOutlineIcon, DeleteOutlined as DeleteOutlineIcon } from "@mui/icons-material";

function FoodManager() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFood, setNewFood] = useState({ name: "", img: "", ingredients: "", details: "", price: "" });

  const fetchFoods = async () => {
    try { const res = await api.get("/food"); setFoods(res.data); setLoading(false); }
    catch (err) { console.log(err); setLoading(false); }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.img) { alert("Name and Image are required"); return; }
    try { await api.post("/food", newFood); setNewFood({ name: "", img: "", ingredients: "", details: "", price: "" }); fetchFoods(); }
    catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/food/${id}`); fetchFoods(); }
    catch (err) { console.log(err); }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "secondary.main", mb: 3 }}>Food Menu Configuration</Typography>

      <Box component="form" onSubmit={handleAdd} sx={{ mb: 4, p: 3, borderRadius: 3, bgcolor: "rgba(26,16,21,0.4)", border: "1px solid", borderColor: "divider" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Food Name" value={newFood.name} onChange={e => setNewFood({ ...newFood, name: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Image URL" value={newFood.img} onChange={e => setNewFood({ ...newFood, img: e.target.value })} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Ingredients" value={newFood.ingredients} onChange={e => setNewFood({ ...newFood, ingredients: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Details" value={newFood.details} onChange={e => setNewFood({ ...newFood, details: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Price ($)" type="number" inputProps={{ step: "0.01" }} value={newFood.price} onChange={e => setNewFood({ ...newFood, price: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth startIcon={<AddCircleOutlineIcon />} sx={{ py: 1.3 }}>
              Add New Food Item
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Grid item xs={12} sm={6} md={4} key={i}><SkeletonLoader type="card" /></Grid>)
        ) : (
          foods.map((food, idx) => (
            <Grid item xs={12} sm={6} md={4} key={food._id}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} whileHover={{ y: -4 }}>
                <Card>
                  <CardMedia component="img" height="180" image={food.img} alt={food.name} sx={{ objectFit: "cover" }} />
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{food.name}</Typography>
                    <Typography variant="h6" sx={{ color: "primary.main", fontFamily: "'Outfit', sans-serif", mb: 1 }}>${food.price || "10.00"}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}><strong>Ingredients:</strong> {food.ingredients || "N/A"}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{food.details || "No details."}</Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button fullWidth variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => handleDelete(food._id)}>
                      Delete Item
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default FoodManager;