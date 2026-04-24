import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useHabitStore } from "../../../store/useHabitStore";
import { CategoryProgressChartCard } from "../../analytics/components/CategoryProgressChartCard";
import { DailyBarChartCard } from "../../analytics/components/DailyBarChartCard";
import { TopHabitsTable } from "../../analytics/components/TopHabitsTable";
import { useAnalyticsData } from "../../analytics/hooks/useAnalyticsData";
import { HabitDialog } from "../components/HabitDialog";
import { HabitMonthGrid } from "../components/HabitMonthGrid";
import { PageHeader } from "../components/PageHeader";
import { SummaryCards } from "../components/SummaryCards";

export function TrackerPage() {
  const completions = useHabitStore((state) => state.completions);
  const addHabit = useHabitStore((state) => state.addHabit);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    dayjs().startOf("month"),
  );
  const analytics = useAnalyticsData(visibleMonth);

  return (
    <Box>
      <PageHeader
        title="Routine Tracker"
        subtitle="A V2 habit operating system with analytics-first tracking."
        actionLabel="Analytics"
        actionTo="/analytics"
      />

      <SummaryCards metrics={analytics.summaryMetrics} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "space-between",
          gap: 2,
          alignItems: { xs: "flex-start", lg: "center" },
          mb: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "2.2rem", md: "2.6rem" } }}
        >
          {analytics.month.format("MMMM YYYY")}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() =>
              setVisibleMonth((month) => month.subtract(1, "month"))
            }
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={() => setVisibleMonth(dayjs().startOf("month"))}
          >
            Today
          </Button>
          <Button
            variant="outlined"
            onClick={() => setVisibleMonth((month) => month.add(1, "month"))}
          >
            Next
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Habit
          </Button>
        </Box>
      </Box>

      {analytics.habits.length === 0 ? (
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="h3">Start your first routine</Typography>
            <Typography color="text.secondary">
              Add a habit, set a monthly goal, and begin tracking your
              consistency day by day.
            </Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Create Habit
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <DailyBarChartCard data={analytics.dailySeries} />
          <CategoryProgressChartCard data={analytics.categorySeries} />
          <HabitMonthGrid
            habits={analytics.habits}
            completions={completions}
            dateKeys={analytics.monthDateKeys}
            onToggle={toggleCompletion}
          />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, xl: 8 }}>
              <TopHabitsTable habits={analytics.topHabits} />
            </Grid>
            <Grid size={{ xs: 12, xl: 4 }}>
              <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                <Typography variant="h3">V2 Enhancements</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Analytics-first layout, reusable calculation modules,
                  centralized theming, and a backend-ready completion map are
                  now wired into the tracker.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      <HabitDialog
        key={`tracker-habit-dialog-${isDialogOpen ? "open" : "closed"}`}
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(input) => {
          addHabit(input);
          setDialogOpen(false);
        }}
      />
    </Box>
  );
}
