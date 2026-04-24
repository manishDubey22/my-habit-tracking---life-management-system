import { Paper, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { appPalette } from "../../../theme";

interface CategoryProgressChartCardProps {
  data: Array<{
    category: string;
    completed: number;
    remaining: number;
    progress: number;
  }>;
}

export function CategoryProgressChartCard({
  data,
}: CategoryProgressChartCardProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, height: "100%" }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Category Performance
      </Typography>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(38,37,30,0.12)" />
          <XAxis type="number" stroke="rgba(38,37,30,0.55)" />
          <YAxis
            dataKey="category"
            type="category"
            stroke="rgba(38,37,30,0.55)"
            width={90}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="completed"
            stackId="category"
            fill={appPalette.violet}
          />
          <Bar
            dataKey="remaining"
            stackId="category"
            fill={appPalette.surfaceStrong}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
