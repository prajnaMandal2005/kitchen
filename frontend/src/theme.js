import { createTheme, alpha } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e11d48",       // Spicy Rose Red
      light: "#fb7185",
      dark: "#be123c",
    },
    secondary: {
      main: "#fca5a5",       // Sweet Peach
      light: "#fecdd3",
      dark: "#f87171",
    },
    background: {
      default: "#1a1015",    // Deep plum
      paper: "rgba(58, 28, 32, 0.85)",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    text: {
      primary: "#fff1f2",
      secondary: "#fecdd3",
    },
    divider: "rgba(255, 200, 200, 0.12)",
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 600 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 500 },
    h6: { fontFamily: "'Playfair Display', serif", fontWeight: 500 },
    button: { fontWeight: 500, letterSpacing: "0.03em" },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(225, 29, 72, 0.06), transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(252, 165, 165, 0.05), transparent 40%)
          `,
          minHeight: "100vh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 200, 200, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 200, 200, 0.1)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${alpha("#e11d48", 0.15)}`,
            borderColor: alpha("#fca5a5", 0.3),
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 40,
          padding: "12px 28px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transition: "0.5s",
          },
          "&:hover::after": {
            left: "100%",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #e11d48 0%, #f97316 100%)",
          boxShadow: `0 6px 20px ${alpha("#e11d48", 0.4)}`,
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(135deg, #f97316 0%, #be123c 100%)",
            boxShadow: `0 10px 30px ${alpha("#e11d48", 0.6)}`,
            transform: "translateY(-3px) scale(1.02)",
          },
          "&:active": {
            transform: "translateY(0) scale(0.98)",
          },
        },
        outlined: {
          borderWidth: "2px",
          borderColor: alpha("#fca5a5", 0.5),
          color: "#fca5a5",
          "&:hover": {
            borderWidth: "2px",
            borderColor: "#fff1f2",
            color: "#fff1f2",
            backgroundColor: alpha("#fca5a5", 0.08),
            transform: "translateY(-2px)",
          },
        },
        text: {
          color: "#fca5a5",
          "&:hover": {
            backgroundColor: alpha("#fca5a5", 0.1),
            transform: "translateX(4px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(26, 16, 21, 0.6)",
            "& fieldset": {
              borderColor: "rgba(255, 200, 200, 0.15)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(252, 165, 165, 0.4)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#fca5a5",
              boxShadow: `0 0 0 3px ${alpha("#fca5a5", 0.15)}`,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#fca5a5",
            fontWeight: 500,
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#fca5a5",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          letterSpacing: "0.03em",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(26, 16, 21, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 200, 200, 0.08)",
          boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(58, 28, 32, 0.6)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
