import { Container, Paper, Stack, Typography } from "@mui/material";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";

export function AppShell() {
  return (
    <main className="min-h-screen py-8">
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Paper elevation={0} className="p-5">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Routine Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Habit tracking and analytics foundation
            </Typography>
          </Paper>
          <DashboardPage />
        </Stack>
      </Container>
    </main>
  );
}
