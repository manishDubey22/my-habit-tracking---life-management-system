import { useCallback, useMemo } from "react";
import { useAppStore } from "../../../store/AppStore";
import { getTasksForDate } from "../../../domain/services/routineService";
import {
  completedCount,
  isCompleted,
} from "../../../domain/services/completionService";
import { lastNDays } from "../../../domain/utils/date";

export function useDashboardData(selectedDate: string) {
  const { tasks, completions } = useAppStore();

  const visibleTasks = useMemo(
    () => getTasksForDate(tasks, selectedDate),
    [tasks, selectedDate],
  );

  const visibleTaskIds = useMemo(
    () => visibleTasks.map((t) => t.id),
    [visibleTasks],
  );

  const completed = useMemo(
    () => completedCount(completions, visibleTaskIds, selectedDate),
    [completions, visibleTaskIds, selectedDate],
  );

  const total = visibleTasks.length;
  const progressPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const isTaskDone = useCallback(
    (taskId: string) => isCompleted(completions, taskId, selectedDate),
    [completions, selectedDate],
  );

  /** Daily completion % for last N days (for chart). */
  const getProgressSeries = useCallback(
    (days: 7 | 30) => {
      const dates = lastNDays(days);
      return dates.map((date) => {
        const dayTasks = getTasksForDate(tasks, date).map((t) => t.id);
        const dayCompleted = completedCount(completions, dayTasks, date);
        const dayTotal = dayTasks.length;
        const pct =
          dayTotal === 0 ? 0 : Math.round((dayCompleted / dayTotal) * 100);
        return { date, pct, label: date.slice(5) };
      });
    },
    [tasks, completions],
  );

  return {
    selectedDate,
    visibleTasks,
    completed,
    total,
    progressPct,
    isTaskDone,
    getProgressSeries,
  };
}
