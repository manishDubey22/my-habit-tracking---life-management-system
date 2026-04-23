import { Box, Button, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useHabitStore } from "../../../store/useHabitStore";
import { HabitDialog } from "../components/HabitDialog";
import { HabitMonthGrid } from "../components/HabitMonthGrid";
import { PageHeader } from "../components/PageHeader";
import { SummaryCards } from "../components/SummaryCards";
import {
  buildSummaryMetrics,
  getActiveHabits,
  getMonthKeys,
} from "../lib/habitInsights";

export function TrackerPage() {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const addHabit = useHabitStore((state) => state.addHabit);
  const toggleCompletion = useHabitStore((state) => state.toggleCompletion);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    dayjs().startOf("month"),
  );

  const activeHabits = useMemo(() => getActiveHabits(habits), [habits]);
  const monthKeys = useMemo(() => getMonthKeys(visibleMonth), [visibleMonth]);
  const summaryMetrics = useMemo(
    () => buildSummaryMetrics(habits, completions, visibleMonth),
    [completions, habits, visibleMonth],
  );

  return (
    <Box>
      <PageHeader
        title="Routine Tracker"
        subtitle="Build better habits, one day at a time."
        actionLabel="Analytics"
        actionTo="/analytics"
        actionIcon="analytics"
      />

      <SummaryCards metrics={summaryMetrics} />

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
          {visibleMonth.format("MMMM YYYY")}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={() =>
              setVisibleMonth((month) => month.subtract(1, "month"))
            }
          >
            ← Previous
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
            Next →
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Habit
          </Button>
        </Box>
      </Box>

      {activeHabits.length === 0 ? (
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
        <HabitMonthGrid
          habits={activeHabits}
          completions={completions}
          dateKeys={monthKeys}
          onToggle={toggleCompletion}
        />
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
