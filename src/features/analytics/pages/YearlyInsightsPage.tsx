import { Box, Button, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  getHabitTrendTimeline,
  getYearComparison,
  getCategoryYearlyProgress,
  getMonthlyProgress,
  getMonthlyTrend,
  getTopHabitsYear,
  getYearSummary,
} from "../../../domain/calculations/yearly";
import { useHabitStore } from "../../../store/useHabitStore";
import { HabitTrendTimeline } from "../components/HabitTrendTimeline";
import { PageHeader } from "../../habits/components/PageHeader";
import { CategoryYearChart } from "../components/CategoryYearChart";
import { MonthlyHeatmap } from "../components/MonthlyHeatmap";
import { MonthlyTrendChart } from "../components/MonthlyTrendChart";
import { TopHabitsYear } from "../components/TopHabitsYear";
import { YearComparisonChart } from "../components/YearComparisonChart";
import { YearSelector } from "../components/YearSelector";
import { YearSummaryCards } from "../components/YearSummaryCards";

export function YearlyInsightsPage() {
  const navigate = useNavigate();
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [compareYear, setCompareYear] = useState(dayjs().year() - 1);
  const effectiveCompareYear =
    compareYear >= selectedYear ? selectedYear - 1 : compareYear;

  const yearly = useMemo(() => {
    const summary = getYearSummary(selectedYear, habits, completions);
    const monthly = getMonthlyProgress(selectedYear, habits, completions);
    const monthlyTrend = getMonthlyTrend(selectedYear, habits, completions);
    const categoryYearly = getCategoryYearlyProgress(
      selectedYear,
      habits,
      completions,
    );
    const topHabits = getTopHabitsYear(selectedYear, habits, completions);
    const yearComparison = getYearComparison(
      effectiveCompareYear,
      selectedYear,
      habits,
      completions,
    );
    const habitTimeline = getHabitTrendTimeline(
      selectedYear,
      habits,
      completions,
    );
    const hasHabits = habits.some((habit) => habit.active);
    const hasAnyMonthData = monthly.some((month) => month.hasData);
    const isFuture = selectedYear > dayjs().year();
    const hasCompareData = getMonthlyProgress(
      effectiveCompareYear,
      habits,
      completions,
    ).some((month) => month.hasData);

    return {
      summary,
      monthly,
      monthlyTrend,
      categoryYearly,
      topHabits,
      yearComparison,
      habitTimeline,
      hasHabits,
      hasAnyMonthData,
      isFuture,
      hasCompareData,
    };
  }, [completions, effectiveCompareYear, habits, selectedYear]);

  const monthLookup = useMemo(
    () =>
      new Map(
        yearly.monthly.map((month) => [
          month.month,
          String(month.monthIndex + 1).padStart(2, "0"),
        ]),
      ),
    [yearly.monthly],
  );

  const navigateToMonth = (monthIndex: number) => {
    navigate(`/analytics/${selectedYear}/${String(monthIndex + 1).padStart(2, "0")}`);
  };

  const navigateToMonthByLabel = (monthLabel: string) => {
    const month = monthLookup.get(monthLabel);
    if (month) {
      navigate(`/analytics/${selectedYear}/${month}`);
    }
  };

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
          <MonthlyHeatmap months={yearly.monthly} onMonthClick={navigateToMonth} />
          <MonthlyTrendChart
            data={yearly.monthlyTrend}
            onMonthClick={navigateToMonthByLabel}
          />
          <YearComparisonChart
            currentYear={selectedYear}
            compareYear={effectiveCompareYear}
            comparison={yearly.yearComparison}
            hasCompareData={yearly.hasCompareData}
            onPreviousCompareYear={() => setCompareYear((year) => year - 1)}
            onNextCompareYear={() =>
              setCompareYear((year) =>
                Math.min(selectedYear - 1, year + 1),
              )
            }
          />
          <CategoryYearChart data={yearly.categoryYearly} />
          <HabitTrendTimeline
            year={selectedYear}
            trends={yearly.habitTimeline}
          />
          <TopHabitsYear habits={yearly.topHabits} />
        </Box>
      )}
    </Box>
  );
}
