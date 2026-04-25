import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HabitTrendTimelineProps {
  year: number;
  trends: Array<{
    habitId: string;
    habitName: string;
    color: string;
    data: Array<{
      month: string;
      value: number;
    }>;
  }>;
}

export function HabitTrendTimeline({
  year,
  trends,
}: HabitTrendTimelineProps) {
  const theme = useTheme();
  const defaultVisible = useMemo(
    () => trends.slice(0, 5).map((trend) => trend.habitId),
    [trends],
  );
  const [visibleIds, setVisibleIds] = useState<string[]>(defaultVisible);

  useEffect(() => {
    setVisibleIds(defaultVisible);
  }, [defaultVisible]);

  const mergedData = useMemo(() => {
    const months = trends[0]?.data.map((point) => point.month) ?? [];

    return months.map((month, index) => {
      const row: Record<string, number | string> = { month };
      trends.forEach((trend) => {
        row[trend.habitName] = trend.data[index]?.value ?? 0;
      });
      return row;
    });
  }, [trends]);

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3">Habit Trend Timeline</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2.5 }}>
        Track which habits stayed consistent, improved, or lost momentum across {year}.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 3 }}>
        {trends.slice(0, 8).map((trend) => (
          <FormControlLabel
            key={trend.habitId}
            control={
              <Checkbox
                size="small"
                checked={visibleIds.includes(trend.habitId)}
                onChange={(_, checked) => {
                  setVisibleIds((current) => {
                    if (checked) {
                      return [...current, trend.habitId];
                    }
                    return current.filter((id) => id !== trend.habitId);
                  });
                }}
                sx={{
                  color: trend.color,
                  "&.Mui-checked": { color: trend.color },
                }}
              />
            }
            label={trend.habitName}
            sx={{
              mr: 1,
              borderRadius: 999,
              px: 1,
              background: "rgba(38, 37, 30, 0.04)",
            }}
          />
        ))}
      </Box>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
          <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
          <Tooltip />
          <Legend />
          {trends
            .filter((trend) => visibleIds.includes(trend.habitId))
            .map((trend) => (
              <Line
                key={trend.habitId}
                type="monotone"
                dataKey={trend.habitName}
                stroke={trend.color}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
