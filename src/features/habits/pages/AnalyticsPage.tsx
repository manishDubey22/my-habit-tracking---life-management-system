import { Box, Button, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { Habit } from "../../../domain/models/habit";
import { useHabitStore } from "../../../store/useHabitStore";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { HabitDialog } from "../components/HabitDialog";
import { HabitManagerList } from "../components/HabitManagerList";
import { PageHeader } from "../components/PageHeader";
import { SummaryCards } from "../components/SummaryCards";
import {
  buildDailySeries,
  buildSummaryMetrics,
  getActiveHabits,
  getCategoryBreakdown,
  getTopHabitSeries,
} from "../lib/habitInsights";

export function AnalyticsPage() {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    dayjs().startOf("month"),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined,
  );

  const activeHabits = useMemo(() => getActiveHabits(habits), [habits]);
  const summaryMetrics = useMemo(
    () => buildSummaryMetrics(habits, completions, visibleMonth),
    [completions, habits, visibleMonth],
  );
  const dailySeries = useMemo(
    () => buildDailySeries(habits, completions, visibleMonth),
    [completions, habits, visibleMonth],
  );
  const categorySeries = useMemo(
    () => getCategoryBreakdown(habits, completions, visibleMonth),
    [completions, habits, visibleMonth],
  );
  const topHabits = useMemo(
    () => getTopHabitSeries(habits, completions, visibleMonth),
    [completions, habits, visibleMonth],
  );

  const openCreate = () => {
    setEditingHabit(undefined);
    setDialogOpen(true);
  };

  const openEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setDialogOpen(true);
  };

  return (
    <Box>
      <PageHeader
        title="Analytics & Insights"
        subtitle="Track your progress and identify the habits that are carrying your month."
        actionLabel="Tracker"
        actionTo="/"
        actionIcon="tracker"
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
          {visibleMonth.format("MMMM YYYY")} Analytics
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
            onClick={() => setVisibleMonth((month) => month.add(1, "month"))}
          >
            Next →
          </Button>
        </Box>
      </Box>

      {activeHabits.length === 0 ? (
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography variant="h3">No analytics yet</Typography>
            <Typography color="text.secondary">
              Create your first habit to unlock daily completion trends,
              category breakdowns, and top performer charts.
            </Typography>
            <Button variant="contained" onClick={openCreate}>
              Add Habit
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <AnalyticsCharts
            dailySeries={dailySeries}
            categorySeries={categorySeries}
            topHabits={topHabits}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              mt: 5,
              mb: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "2rem", md: "2.4rem" } }}
            >
              Manage Habits
            </Typography>
            <Button variant="contained" onClick={openCreate}>
              Add Habit
            </Button>
          </Box>

          <HabitManagerList
            habits={activeHabits}
            onEdit={openEdit}
            onDelete={deleteHabit}
          />
        </>
      )}

      <HabitDialog
        key={`analytics-habit-dialog-${editingHabit?.id ?? "create"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingHabit(undefined);
        }}
        initialHabit={editingHabit}
        onSubmit={(input) => {
          if (editingHabit) {
            updateHabit({ id: editingHabit.id, ...input });
          } else {
            addHabit(input);
          }
          setDialogOpen(false);
          setEditingHabit(undefined);
        }}
      />
    </Box>
  );
}
