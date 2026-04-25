import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { Habit } from "../../../domain/models/habit";
import { useHabitStore } from "../../../store/useHabitStore";
import { HabitDialog } from "../../habits/components/HabitDialog";
import { HabitManagerList } from "../../habits/components/HabitManagerList";
import { PageHeader } from "../../habits/components/PageHeader";
import { SummaryCards } from "../../habits/components/SummaryCards";
import { CategoryProgressChartCard } from "../components/CategoryProgressChartCard";
import { DailyBarChartCard } from "../components/DailyBarChartCard";
import { TopHabitsTable } from "../components/TopHabitsTable";
import { WeeklyCards } from "../components/WeeklyCards";
import { useAnalyticsData } from "../hooks/useAnalyticsData";

export function AnalyticsPage() {
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    dayjs().startOf("month"),
  );
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const analytics = useAnalyticsData(visibleMonth);

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
        subtitle="A production-style analytics view with weekly progress, category performance, and habit ranking."
        actionLabel="Tracker"
        actionTo="/"
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
          {analytics.month.format("MMMM YYYY")} Analytics
        </Typography>

        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <Button
            component={RouterLink}
            to="/analytics/year"
            variant="contained"
          >
            Yearly Insights
          </Button>
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
            onClick={() => setVisibleMonth((month) => month.add(1, "month"))}
          >
            Next
          </Button>
        </Box>
      </Box>

      {analytics.habits.length === 0 ? (
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
          <Typography variant="h3">No analytics yet</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Create your first habit to unlock the V2 analytics layer.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={openCreate}>
            Add Habit
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <WeeklyCards weeks={analytics.weeklySeries} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, xl: 7 }}>
              <DailyBarChartCard data={analytics.dailySeries} />
            </Grid>
            <Grid size={{ xs: 12, xl: 5 }}>
              <CategoryProgressChartCard data={analytics.categorySeries} />
            </Grid>
          </Grid>

          <TopHabitsTable habits={analytics.topHabits} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
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
            habits={analytics.habits}
            onEdit={openEdit}
            onDelete={deleteHabit}
          />
        </Box>
      )}

      <HabitDialog
        key={`analytics-dialog-${editingHabit?.id ?? "create"}-${dialogOpen ? "open" : "closed"}`}
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
