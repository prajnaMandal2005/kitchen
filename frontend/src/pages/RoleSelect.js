import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardActionArea, Typography, Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import QuoteBanner from "../components/QuoteBanner";
import { 
  Restaurant as RestaurantIcon, 
  LocalBar as LocalBarIcon, 
  SoupKitchen as SoupKitchenIcon, 
  AdminPanelSettings as AdminPanelSettingsIcon 
} from "@mui/icons-material";

const roles = [
  { key: "customer", label: "Customer", desc: "Explore the menu and order exquisite dishes", icon: <RestaurantIcon sx={{ fontSize: { xs: 24, md: 44 } }} />, color: "#e11d48" },
  { key: "waiter", label: "Waiter", desc: "Serve guests and manage dining experiences", icon: <LocalBarIcon sx={{ fontSize: { xs: 24, md: 44 } }} />, color: "#f97316" },
  { key: "chef", label: "Chef", desc: "Prepare culinary masterpieces for our guests", icon: <SoupKitchenIcon sx={{ fontSize: { xs: 24, md: 44 } }} />, color: "#fca5a5" },
  { key: "manager", label: "Manager", desc: "Oversee operations and maintain excellence", icon: <AdminPanelSettingsIcon sx={{ fontSize: { xs: 24, md: 44 } }} />, color: "#10b981" },
];

function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    if (role === "customer") navigate("/login");
    else navigate("/worker-login", { state: { defaultRole: role } });
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3, position: "relative", overflow: "hidden" }}>
        {/* Decorative glow */}
        <Box sx={{ position: "absolute", top: "-10%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <Box sx={{ position: "absolute", bottom: "-10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(252,165,165,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", color: "secondary.main", textAlign: "center", mb: 1, fontSize: { xs: "2.5rem", md: "4rem" }, textShadow: "0 4px 30px rgba(225,29,72,0.2)" }}>
            Prajna's Kitchen
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary", mb: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.95rem" }}>
            Select your portal to continue
          </Typography>
        </motion.div>

        <QuoteBanner category="auth" />

        <Container maxWidth="lg" sx={{ zIndex: 1 }}>
          <Grid container spacing={2} sx={{ justifyContent: "center", flexWrap: 'nowrap', overflowX: 'auto', pb: 2 }}>
            {roles.map((role, i) => (
              <Grid xs={3} key={role.key}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card sx={{ borderTop: `4px solid ${role.color}`, textAlign: "center" }}>
                      <CardActionArea onClick={() => handleRoleClick(role.key)} sx={{ p: { xs: 2, md: 4 } }}>
                        <Avatar sx={{ width: { xs: 50, md: 80 }, height: { xs: 50, md: 80 }, mx: "auto", mb: { xs: 1.5, md: 2.5 }, bgcolor: `${role.color}22`, color: role.color }}>
                          {role.icon}
                        </Avatar>
                        <Typography variant="h5" sx={{ mb: 1, color: "text.primary", fontSize: { xs: "1rem", md: "1.5rem" } }}>{role.label}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: { xs: "0.7rem", md: "0.875rem" }, display: { xs: "none", sm: "block" } }}>{role.desc}</Typography>
                      </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  );
}

export default RoleSelect;