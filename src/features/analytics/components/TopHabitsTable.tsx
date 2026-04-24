import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface TopHabitsTableProps {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    goal: number;
    completedDays: number;
    score: number;
    color: string;
  }>;
  title?: string;
}

export function TopHabitsTable({
  habits,
  title = "Top Habits Ranking",
}: TopHabitsTableProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 2.5 }}>
        {title}
      </Typography>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Habit</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Goal</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "999px",
                        backgroundColor: habit.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2">{habit.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={habit.category} size="small" />
                </TableCell>
                <TableCell align="right">{habit.goal}</TableCell>
                <TableCell align="right">{habit.completedDays}</TableCell>
                <TableCell align="right">
                  <Typography sx={{ color: "secondary.main", fontWeight: 700 }}>
                    {habit.score}%
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
