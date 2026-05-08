import axios from "axios";

// This is the ONLY place you need to change your URL when you deploy!
// 1. Keep it as "http://localhost:5000" while testing on your computer.
// 2. Change it to your Render URL (e.g., "https://prajna-kitchen.onrender.com") when you deploy.

// Change this to "/api" for Netlify deployment
const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
