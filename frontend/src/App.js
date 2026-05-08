import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

// PAGES
import RoleSelect from "./pages/RoleSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import FoodDetails from "./pages/FoodDetails";
import MyOrders from "./pages/MyOrders";

// WORKER PAGES
import WorkerRegister from "./pages/WorkerRegister";
import WorkerLogin from "./pages/WorkerLogin";
import ChefDashboard from "./pages/ChefDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";

// COMPONENTS
import ProtectedRoute from "./components/ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/worker-register" element={<WorkerRegister />} />
        <Route path="/worker-login" element={<WorkerLogin />} />

        {/* --- CUSTOMER ROUTES (Protected) --- */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/food/:id" element={<ProtectedRoute><FoodDetails /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

        {/* --- WORKER ROUTES (Protected) --- */}
        <Route path="/chef" element={<ProtectedRoute><ChefDashboard /></ProtectedRoute>} />
        <Route path="/waiter" element={<ProtectedRoute><WaiterDashboard /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
