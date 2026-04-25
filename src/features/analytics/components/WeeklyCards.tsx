import { Box, Grid, Paper, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { appPalette } from "../../../theme";

interface WeeklyCardsProps {
  weeks: Array<{
    key: string;
    label: string;
    shortLabel: string;
    progress: number;
    completed: number;
    total: number;
  }>;
}

export function WeeklyCards({ weeks }: WeeklyCardsProps) {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Weekly Donut Charts
      </Typography>
      <Grid container spacing={2}>
        {weeks.map((week, index) => (
          <Grid key={week.key} size={{ xs: 12, sm: 6, xl: 3 }}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 4,
                background:
                  index % 2 === 0
                    ? "linear-gradient(180deg, rgba(159, 187, 224, 0.16), rgba(255,255,255,0.92))"
                    : "linear-gradient(180deg, rgba(192, 168, 221, 0.18), rgba(255,255,255,0.92))",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {week.shortLabel}
              </Typography>
              <Typography variant="h4" sx={{ fontSize: "1.2rem", mt: 0.25 }}>
                {week.label}
              </Typography>
              <Box sx={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Completed", value: week.progress },
                        { name: "Remaining", value: 100 - week.progress },
                      ]}
                      dataKey="value"
                      innerRadius={48}
                      outerRadius={68}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill={appPalette.violet} />
                      <Cell fill="rgba(38, 37, 30, 0.08)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Typography
                variant="h2"
                sx={{ fontSize: "2rem", color: "secondary.main" }}
              >
                {week.progress}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {week.completed} of {week.total} slots completed
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
