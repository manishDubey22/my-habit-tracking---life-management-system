import { Paper, Typography, useTheme } from "@mui/material";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyTrendChartProps {
  data: Array<{
    month: string;
    value: number;
  }>;
  onMonthClick?: (monthLabel: string) => void;
}

export function MonthlyTrendChart({
  data,
  onMonthClick,
}: MonthlyTrendChartProps) {
  const theme = useTheme();
  const highestValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Monthly Trend
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        See how consistency moved across the year and where momentum changed.
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          onClick={(state) => {
            const monthLabel = state?.activeLabel;
            if (typeof monthLabel === "string") {
              onMonthClick?.(monthLabel);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
          <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
          <Tooltip formatter={(value) => [`${value}%`, "Consistency"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            activeDot={{ r: 6 }}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (typeof cx !== "number" || typeof cy !== "number") return null;

              const isHighest =
                payload.value === highestValue && highestValue > 0;
              return (
                <Dot
                  cx={cx}
                  cy={cy}
                  r={isHighest ? 6 : 4}
                  fill={
                    isHighest
                      ? theme.palette.warning.main
                      : theme.palette.primary.main
                  }
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
