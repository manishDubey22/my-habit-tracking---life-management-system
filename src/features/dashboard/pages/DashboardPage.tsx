import { Card, CardContent, Stack, Typography } from "@mui/material";
import { HabitGrid } from "../../habits/components/HabitGrid";
import { HabitForm } from "../../habits/components/HabitForm";

export function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            Habits
          </Typography>
          <HabitForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            Monthly Grid
          </Typography>
          <HabitGrid />
        </CardContent>
      </Card>
    </Stack>
  );
}
