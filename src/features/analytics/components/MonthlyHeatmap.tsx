import { Box, Paper, Tooltip, Typography } from "@mui/material";
import { appPalette } from "../../../theme";

interface MonthlyHeatmapProps {
  months: Array<{
    monthIndex: number;
    month: string;
    value: number;
    completed: number;
    totalPossible: number;
    hasData: boolean;
  }>;
}

function getHeatColor(value: number, hasData: boolean) {
  if (!hasData) return "rgba(38, 37, 30, 0.05)";
  if (value <= 20) return "rgba(38, 37, 30, 0.08)";
  if (value <= 50) return "rgba(159, 187, 224, 0.32)";
  if (value <= 80) return "rgba(143, 46, 255, 0.26)";
  return "rgba(143, 46, 255, 0.46)";
}

function getHeatText(value: number, hasData: boolean) {
  if (!hasData) return "rgba(38, 37, 30, 0.55)";
  if (value <= 20) return "rgba(38, 37, 30, 0.72)";
  if (value <= 50) return "#355d8f";
  if (value <= 80) return "#6f43a6";
  return appPalette.violetStrong;
}

export function MonthlyHeatmap({ months }: MonthlyHeatmapProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
      <Typography variant="h3" sx={{ mb: 1 }}>
        Monthly Heatmap
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Your year at a glance, with each month shaded by consistency.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {months.map((month) => {
          const background = getHeatColor(month.value, month.hasData);
          const textColor = getHeatText(month.value, month.hasData);

          return (
            <Tooltip
              key={month.month}
              title={`${month.month}: ${month.hasData ? `${month.value}% consistency (${month.completed}/${month.totalPossible})` : "No data yet"}`}
              arrow
            >
              <Box
                sx={{
                  p: 2,
                  minHeight: 136,
                  borderRadius: 3,
                  border: "1px solid rgba(38, 37, 30, 0.08)",
                  background,
                  color: textColor,
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "rgba(0,0,0,0.06) 0px 14px 24px",
                  },
                }}
              >
                <Typography variant="body2" sx={{ color: textColor }}>
                  {month.month}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ mt: 1.5, fontSize: "1.9rem", color: textColor }}
                >
                  {month.hasData ? `${month.value}%` : "--"}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.55)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${month.value}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: month.hasData
                        ? `linear-gradient(90deg, ${appPalette.sky}, ${appPalette.violet})`
                        : "transparent",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ mt: 1.25, display: "block" }}
                >
                  {month.hasData
                    ? `${month.completed} completed of ${month.totalPossible}`
                    : "No data yet"}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Paper>
  );
}
