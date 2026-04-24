import { Paper, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { appPalette } from "../../../theme";

interface DailyBarChartCardProps {
  data: Array<{
    day: number;
    completed: number;
    remaining: number;
    progress: number;
    dateLabel: string;
  }>;
}

export function DailyBarChartCard({ data }: DailyBarChartCardProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Daily Progress
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(38,37,30,0.12)" />
          <XAxis dataKey="day" stroke="rgba(38,37,30,0.55)" />
          <YAxis domain={[0, 100]} stroke="rgba(38,37,30,0.55)" />
          <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
          <Bar dataKey="progress" radius={[10, 10, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.dateLabel}
                fill={entry.progress >= 70 ? appPalette.violet : appPalette.sky}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
