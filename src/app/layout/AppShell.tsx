import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(192, 168, 221, 0.18), transparent 28%), var(--app-bg)",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
