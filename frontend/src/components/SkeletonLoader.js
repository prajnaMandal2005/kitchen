import { Box, Skeleton, Paper } from "@mui/material";

function SkeletonLoader({ type = "card" }) {
  if (type === "card") {
    return (
      <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Skeleton variant="rectangular" height={220} animation="wave" />
        <Box sx={{ p: 2.5 }}>
          <Skeleton variant="text" width="70%" height={32} animation="wave" />
          <Skeleton variant="text" width="40%" height={24} animation="wave" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={18} animation="wave" />
          <Skeleton variant="text" width="85%" height={18} animation="wave" sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={44} animation="wave" sx={{ borderRadius: 8 }} />
        </Box>
      </Paper>
    );
  }

  if (type === "list") {
    return (
      <Paper sx={{ p: 2, mb: 1.5, display: "flex", alignItems: "center", gap: 2, borderRadius: 3 }}>
        <Skeleton variant="rounded" width={50} height={50} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={22} animation="wave" />
          <Skeleton variant="text" width="40%" height={16} animation="wave" />
        </Box>
      </Paper>
    );
  }

  if (type === "text") {
    return <Skeleton variant="text" width="100%" height={20} animation="wave" sx={{ mb: 0.5 }} />;
  }

  if (type === "title") {
    return <Skeleton variant="text" width="60%" height={40} animation="wave" sx={{ mb: 1 }} />;
  }

  return null;
}

export default SkeletonLoader;
