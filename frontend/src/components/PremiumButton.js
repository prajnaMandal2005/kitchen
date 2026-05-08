import { Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const PremiumButton = ({ children, sx, ...props }) => {
  return (
    <MotionButton
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 0 25px rgba(225, 29, 72, 0.4)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }}
      sx={{
        ...sx,
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)",
          opacity: 0,
          transition: "opacity 0.3s",
        },
        "&:hover::after": {
          opacity: 1,
        }
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default PremiumButton;
