import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { SummaryMetric } from "../../../domain/calculations/progress";

const toneStyles = {
  violet: {
    bg: "linear-gradient(135deg, rgba(143, 46, 255, 0.12), rgba(143, 46, 255, 0.04))",
    color: "#8f2eff",
  },
  pink: {
    bg: "linear-gradient(135deg, rgba(236, 72, 153, 0.16), rgba(236, 72, 153, 0.05))",
    color: "#db2777",
  },
  blue: {
    bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.16), rgba(59, 130, 246, 0.05))",
    color: "#2563eb",
  },
  amber: {
    bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(245, 158, 11, 0.05))",
    color: "#d97706",
  },
  green: {
    bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(16, 185, 129, 0.05))",
    color: "#059669",
  },
} as const;

export function SummaryCards({ metrics }: { metrics: SummaryMetric[] }) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {metrics.map((metric) => {
        const tone = toneStyles[metric.tone];

        return (
          <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: tone.bg,
                minHeight: 128,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="body1">{metric.label}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: { xs: "2rem", md: "2.25rem" },
                      color: tone.color,
                    }}
                  >
                    {metric.value}
                  </Typography>
                  {typeof metric.progress === "number" ? (
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={48}
                        thickness={4.2}
                        sx={{ color: "rgba(38, 37, 30, 0.08)" }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={metric.progress}
                        size={48}
                        thickness={4.2}
                        sx={{
                          color: tone.color,
                          position: "absolute",
                          left: 0,
                        }}
                      />
                    </Box>
                  ) : null}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
