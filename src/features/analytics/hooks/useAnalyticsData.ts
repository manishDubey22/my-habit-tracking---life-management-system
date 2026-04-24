import type { Dayjs } from "dayjs";
import { useMemo } from "react";
import { buildCategoryProgressSeries } from "../../../domain/calculations/category";
import {
  buildDailyProgressSeries,
  buildSummaryMetrics,
  buildTopHabits,
  getActiveHabits,
  getMonthDateKeys,
} from "../../../domain/calculations/progress";
import { buildWeeklyProgressSeries } from "../../../domain/calculations/weekly";
import { useHabitStore } from "../../../store/useHabitStore";

export function useAnalyticsData(month: Dayjs) {
  const habits = useHabitStore((state) => state.habits);
  const completions = useHabitStore((state) => state.completions);

  return useMemo(() => {
    const normalizedMonth = month.startOf("month");

    return {
      month: normalizedMonth,
      habits: getActiveHabits(habits),
      monthDateKeys: getMonthDateKeys(normalizedMonth),
      completions,
      summaryMetrics: buildSummaryMetrics(normalizedMonth, habits, completions),
      dailySeries: buildDailyProgressSeries(
        normalizedMonth,
        habits,
        completions,
      ),
      weeklySeries: buildWeeklyProgressSeries(
        normalizedMonth,
        habits,
        completions,
      ),
      categorySeries: buildCategoryProgressSeries(
        normalizedMonth,
        habits,
        completions,
      ),
      topHabits: buildTopHabits(normalizedMonth, habits, completions),
    };
  }, [completions, habits, month]);
}
