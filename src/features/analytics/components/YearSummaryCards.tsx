import { Grid, Paper, Typography } from "@mui/material";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { appPalette } from "../../../theme";

interface YearSummaryCardsProps {
  summary: {
    totalHabits: number;
    totalCompletions: number;
    avgConsistency: number;
    bestMonth: { month: string; value: number };
    worstMonth: { month: string; value: number };
  };
}

const cardStyles = [
  {
    title: "Total Habits",
    valueKey: "totalHabits",
    tone: "rgba(159, 187, 224, 0.18)",
    accent: appPalette.sky,
  },
  {
    title: "Total Completions",
    valueKey: "totalCompletions",
    tone: "rgba(192, 168, 221, 0.18)",
    accent: appPalette.violet,
  },
  {
    title: "Average Consistency",
    valueKey: "avgConsistency",
    tone: "rgba(159, 201, 162, 0.18)",
    accent: appPalette.success,
  },
  {
    title: "Best Month",
    valueKey: "bestMonth",
    tone: "rgba(223, 168, 143, 0.22)",
    accent: appPalette.orange,
  },
  {
    title: "Worst Month",
    valueKey: "worstMonth",
    tone: "rgba(192, 168, 221, 0.14)",
    accent: appPalette.gold,
  },
] as const;

export function YearSummaryCards({ summary }: YearSummaryCardsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {cardStyles.map((card) => {
        const gaugeValue =
          card.valueKey === "avgConsistency"
            ? summary.avgConsistency
            : card.valueKey === "bestMonth"
              ? summary.bestMonth.value
              : card.valueKey === "worstMonth"
                ? summary.worstMonth.value
                : undefined;

        const labelValue =
          card.valueKey === "totalHabits"
            ? `${summary.totalHabits}`
            : card.valueKey === "totalCompletions"
              ? `${summary.totalCompletions}`
              : card.valueKey === "avgConsistency"
                ? `${summary.avgConsistency}%`
                : card.valueKey === "bestMonth"
                  ? `${summary.bestMonth.month} ${summary.bestMonth.value}%`
                  : `${summary.worstMonth.month} ${summary.worstMonth.value}%`;

        return (
          <Grid key={card.title} size={{ xs: 12, sm: 6, xl: 2.4 }}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 4,
                minHeight: 170,
                background: `linear-gradient(180deg, ${card.tone}, rgba(255,255,255,0.88))`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontSize: "1.65rem" }}>
                {labelValue}
              </Typography>

              {typeof gaugeValue === "number" ? (
                <ResponsiveContainer width="100%" height={86}>
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={[{ value: gaugeValue }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={999}
                      fill={card.accent}
                      background={{ fill: "rgba(38, 37, 30, 0.08)" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              ) : null}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
