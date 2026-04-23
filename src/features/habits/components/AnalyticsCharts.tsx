import { Grid, Paper, Stack, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsChartsProps {
  dailySeries: Array<{
    day: number;
    completionRate: number;
    completedCount: number;
    dateLabel: string;
  }>;
  categorySeries: Array<{
    name: string;
    value: number;
  }>;
  topHabits: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const pieColors = [
  "#8f2eff",
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#6366f1",
];

export function AnalyticsCharts({
  dailySeries,
  categorySeries,
  topHabits,
}: AnalyticsChartsProps) {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Daily Progress
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dailySeries}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(38,37,30,0.12)" />
            <XAxis dataKey="day" stroke="rgba(38,37,30,0.55)" />
            <YAxis domain={[0, 100]} stroke="rgba(38,37,30,0.55)" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="#8f2eff"
              strokeWidth={2}
              name="Completion %"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, height: "100%" }}
          >
            <Typography variant="h3" sx={{ mb: 3 }}>
              Category Progress
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categorySeries}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={92}
                  innerRadius={42}
                  paddingAngle={4}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categorySeries.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${entry.value}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, height: "100%" }}
          >
            <Typography variant="h3" sx={{ mb: 3 }}>
              Top Habits
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topHabits}>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(38,37,30,0.12)"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(38,37,30,0.55)"
                  angle={-42}
                  textAnchor="end"
                  interval={0}
                  height={72}
                />
                <YAxis stroke="rgba(38,37,30,0.55)" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                  {topHabits.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
