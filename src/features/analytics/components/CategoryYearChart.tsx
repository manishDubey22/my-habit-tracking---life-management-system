import { Paper, Typography, useTheme } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryYearChartProps {
  data: Array<{
    category: string;
    completed: number;
    total: number;
    percentage: number;
  }>;
}

export function CategoryYearChart({ data }: CategoryYearChartProps) {
  const theme = useTheme();

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Category Yearly Breakdown
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Which areas of life stayed strongest across the whole year.
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="category" stroke={theme.palette.text.primary} />
          <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
          <Tooltip
            formatter={(value, _, item) => [
              `${value}%`,
              `${item.payload.category} consistency`,
            ]}
          />
          <Bar
            dataKey="percentage"
            fill={theme.palette.secondary.main}
            radius={[8, 8, 0, 0]}
          >
            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(value) => `${value}%`}
              fill={theme.palette.text.primary}
            />
            {data.map((entry, index) => (
              <Cell
                key={`${entry.category}-${index}`}
                fill={
                  index === 0
                    ? theme.palette.secondary.main
                    : "rgba(143, 46, 255, 0.72)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
