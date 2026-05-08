require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routers
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const workerRoutes = require("./routes/workerRoutes"); 
const authRoutes = require("./routes/authRoutes");

const app = express();

// --- MIDDLEWARE ---
// Updated CORS to be flexible for deployment
app.use(cors({
  origin: "*", // Allow all origins for now (simplest for deployment)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); 

// --- DATABASE CONNECTION ---
// Using MONGO_URI from .env (for Atlas) or falling back to local
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodApp";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Successfully connected to database"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/workers", workerRoutes);

// --- START SERVER ---
if (process.env.NODE_ENV !== "production" && !process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;