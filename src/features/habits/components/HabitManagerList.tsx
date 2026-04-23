import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import type { Habit } from "../../../domain/models/habit";

interface HabitManagerListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export function HabitManagerList({
  habits,
  onEdit,
  onDelete,
}: HabitManagerListProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {habits.map((habit) => (
        <Paper key={habit.id} sx={{ p: 3, borderRadius: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "999px",
                    backgroundColor: habit.color ?? "secondary.main",
                  }}
                />
                <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>
                  {habit.title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.25 }}>
                <Chip label={habit.category} />
                <Chip label={`Goal: ${habit.monthlyGoal} days`} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="text"
                color="secondary"
                onClick={() => onEdit(habit)}
              >
                Edit
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={() => onDelete(habit.id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
