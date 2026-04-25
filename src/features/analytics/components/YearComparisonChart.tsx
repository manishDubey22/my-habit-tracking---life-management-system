import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
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

interface YearComparisonChartProps {
  currentYear: number;
  compareYear: number;
  onPreviousCompareYear: () => void;
  onNextCompareYear: () => void;
  comparison: {
    yearA: number;
    yearB: number;
    delta: number;
    data: Array<{
      month: string;
      yearA: number;
      yearB: number;
    }>;
  };
  hasCompareData: boolean;
}

export function YearComparisonChart({
  currentYear,
  compareYear,
  onPreviousCompareYear,
  onNextCompareYear,
  comparison,
  hasCompareData,
}: YearComparisonChartProps) {
  const theme = useTheme();
  const deltaTone =
    comparison.delta > 0
      ? theme.palette.success.main
      : comparison.delta < 0
        ? theme.palette.error.main
        : theme.palette.text.secondary;

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", lg: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h3">Year vs Year Comparison</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Compare momentum across two years and spot whether the current year is ahead or behind.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="outlined" onClick={onPreviousCompareYear}>
            ← {compareYear - 1}
          </Button>
          <Typography variant="body2" sx={{ px: 1 }}>
            {compareYear} vs {currentYear}
          </Typography>
          <Button
            variant="outlined"
            onClick={onNextCompareYear}
            disabled={compareYear >= currentYear - 1}
          >
            {compareYear + 1} →
          </Button>
        </Box>
      </Box>

      <Typography sx={{ color: deltaTone, fontWeight: 700, mb: 2 }}>
        {comparison.delta > 0
          ? `+${comparison.delta}% improvement from ${compareYear} to ${currentYear}`
          : comparison.delta < 0
            ? `${comparison.delta}% change from ${compareYear} to ${currentYear}`
            : `No consistency change between ${compareYear} and ${currentYear}`}
      </Typography>

      {!hasCompareData ? (
        <Typography color="text.secondary">
          No previous year data is available for {compareYear} yet.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={comparison.data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
            <YAxis domain={[0, 100]} stroke={theme.palette.text.secondary} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="yearA"
              name={`${compareYear}`}
              stroke={theme.palette.secondary.main}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="yearB"
              name={`${currentYear}`}
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
