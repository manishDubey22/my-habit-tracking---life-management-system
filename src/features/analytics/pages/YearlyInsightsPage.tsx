import { Box, Button, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  getMonthlyProgress,
  getTopHabitsYear,
  getYearSummary,
} from "../../../domain/calculations/yearly";
import { useHabitStore } from "../../../store/useHabitStore";
import { PageHeader } from "../../habits/components/PageHeader";
import { MonthlyHeatmap } from "../components/MonthlyHeatmap";
import { TopHabitsYear } from "../components/TopHabitsYear";
import { YearSelector } from "../components/YearSelector";
import { YearSummaryCards } from "../components/YearSummaryCards";

export function YearlyInsightsPage() {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const yearly = useMemo(() => {
    const summary = getYearSummary(selectedYear, habits, completions);
    const monthly = getMonthlyProgress(selectedYear, habits, completions);
    const topHabits = getTopHabitsYear(selectedYear, habits, completions);
    const hasHabits = habits.some((habit) => habit.active);
    const hasAnyMonthData = monthly.some((month) => month.hasData);
    const isFuture = selectedYear > dayjs().year();

    return {
      summary,
      monthly,
      topHabits,
      hasHabits,
      hasAnyMonthData,
      isFuture,
    };
  }, [completions, habits, selectedYear]);

  return (
    <Box>
      <PageHeader
        title="Yearly Insights"
        subtitle="See your whole year through consistency, momentum, and the habits that carried you."
        actionLabel="Monthly Analytics"
        actionTo="/analytics"
      />

      <YearSelector
        year={selectedYear}
        onPrevious={() => setSelectedYear((year) => year - 1)}
        onNext={() => setSelectedYear((year) => year + 1)}
      />

      {!yearly.hasHabits ? (
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h3">No habits yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Create habits first, then this screen will turn into your yearly
            insight system.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            component={RouterLink}
            to="/"
          >
            Go To Tracker
          </Button>
        </Paper>
      ) : yearly.isFuture || !yearly.hasAnyMonthData ? (
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h3">No data yet for {selectedYear}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try the current year or a previous year to review real activity and
            consistency.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <YearSummaryCards summary={yearly.summary} />
          <MonthlyHeatmap months={yearly.monthly} />
          <TopHabitsYear habits={yearly.topHabits} />
        </Box>
      )}
    </Box>
  );
}
