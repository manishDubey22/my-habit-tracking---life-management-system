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

interface TopHabitsYearProps {
  habits: Array<{
    id: string;
    name: string;
    color: string;
    category: string;
    totalCompletions: number;
    consistency: number;
    rank: number;
    badge?: string;
  }>;
}

function getRankLabel(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}`;
}

export function TopHabitsYear({ habits }: TopHabitsYearProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 2.5 }}>
        Top Habits This Year
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Habit</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Consistency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell sx={{ fontWeight: 700 }}>
                  {getRankLabel(habit.rank)}
                </TableCell>
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
                    <Box>
                      <Typography variant="body2">{habit.name}</Typography>
                      {habit.badge ? (
                        <Typography variant="caption" color="text.secondary">
                          {habit.badge}
                        </Typography>
                      ) : null}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={habit.category} size="small" />
                </TableCell>
                <TableCell align="right">{habit.totalCompletions}</TableCell>
                <TableCell align="right">
                  <Typography sx={{ color: "secondary.main", fontWeight: 700 }}>
                    {habit.consistency}%
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
