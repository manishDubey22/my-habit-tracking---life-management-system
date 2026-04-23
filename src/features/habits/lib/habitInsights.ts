import dayjs, { type Dayjs } from "dayjs";
import type { Completion } from "../../../domain/models/completion";
import type { Habit } from "../../../domain/models/habit";
import { monthRangeKeys } from "../../../utils/date";

export interface SummaryMetric {
  label: string;
  value: string;
  tone: "violet" | "pink" | "blue" | "amber" | "green";
}

export function getActiveHabits(habits: Habit[]) {
  return habits.filter((habit) => habit.active);
}

export function getMonthKeys(month: Dayjs) {
  return monthRangeKeys(month.year(), month.month());
}

export function getWeekChunks<T>(items: T[], chunkSize = 7) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

export function isHabitCompletedOnDate(
  completions: Completion[],
  habitId: string,
  dateKey: string,
) {
  return completions.some(
    (completion) =>
      completion.habitId === habitId && completion.dateKey === dateKey,
  );
}

export function getMonthCompletions(
  completions: Completion[],
  monthKeys: string[],
  activeHabitIds: string[],
) {
  const monthSet = new Set(monthKeys);
  const habitSet = new Set(activeHabitIds);
  return completions.filter(
    (completion) =>
      habitSet.has(completion.habitId) && monthSet.has(completion.dateKey),
  );
}

export function buildSummaryMetrics(
  habits: Habit[],
  completions: Completion[],
  month: Dayjs,
): SummaryMetric[] {
  const activeHabits = getActiveHabits(habits);
  const monthKeys = getMonthKeys(month);
  const monthCompletions = getMonthCompletions(
    completions,
    monthKeys,
    activeHabits.map((habit) => habit.id),
  );

  const totalHabits = activeHabits.length;
  const completionCount = monthCompletions.length;
  const totalSlots = totalHabits * monthKeys.length;
  const completionRate =
    totalSlots === 0 ? 0 : Math.round((completionCount / totalSlots) * 100);
  const avgDaily =
    monthKeys.length === 0 ? 0 : Math.round(completionCount / monthKeys.length);
  const onTrackCount = activeHabits.filter((habit) => {
    const habitCompletions = monthCompletions.filter(
      (completion) => completion.habitId === habit.id,
    ).length;
    const elapsedDays = Math.max(
      1,
      Math.min(
        dayjs().isSame(month, "month") ? dayjs().date() : month.daysInMonth(),
        month.daysInMonth(),
      ),
    );
    const expectedByNow = Math.round(
      (habit.monthlyGoal / month.daysInMonth()) * elapsedDays,
    );
    return habitCompletions >= expectedByNow;
  }).length;

  return [
    { label: "Total Habits", value: `${totalHabits}`, tone: "violet" },
    { label: "Completions (Month)", value: `${completionCount}`, tone: "pink" },
    { label: "Avg Daily", value: `${avgDaily}`, tone: "blue" },
    { label: "Completion Rate", value: `${completionRate}%`, tone: "amber" },
    {
      label: "On Track",
      value: `${onTrackCount}/${totalHabits || 0}`,
      tone: "green",
    },
  ];
}

export function buildDailySeries(
  habits: Habit[],
  completions: Completion[],
  month: Dayjs,
) {
  const activeHabits = getActiveHabits(habits);
  const monthKeys = getMonthKeys(month);

  return monthKeys.map((dateKey) => {
    const completedCount = completions.filter(
      (completion) =>
        completion.dateKey === dateKey &&
        activeHabits.some((habit) => habit.id === completion.habitId),
    ).length;
    const completionRate =
      activeHabits.length === 0
        ? 0
        : Math.round((completedCount / activeHabits.length) * 100);

    return {
      day: dayjs(dateKey).date(),
      completionRate,
      completedCount,
      dateLabel: dayjs(dateKey).format("DD MMM"),
    };
  });
}

export function getCategoryBreakdown(
  habits: Habit[],
  completions: Completion[],
  month: Dayjs,
) {
  const activeHabits = getActiveHabits(habits);
  const monthKeys = new Set(getMonthKeys(month));
  const totalPossible = month.daysInMonth();

  return Object.values(
    activeHabits.reduce<
      Record<string, { name: string; value: number; goal: number }>
    >((acc, habit) => {
      const completed = completions.filter(
        (completion) =>
          completion.habitId === habit.id && monthKeys.has(completion.dateKey),
      ).length;
      const current = acc[habit.category] ?? {
        name: habit.category,
        value: 0,
        goal: 0,
      };

      current.value += completed;
      current.goal += Math.min(habit.monthlyGoal, totalPossible);
      acc[habit.category] = current;
      return acc;
    }, {}),
  )
    .map((item) => ({
      name: item.name,
      value: item.goal === 0 ? 0 : Math.round((item.value / item.goal) * 100),
    }))
    .sort((left, right) => right.value - left.value);
}

export function getTopHabitSeries(
  habits: Habit[],
  completions: Completion[],
  month: Dayjs,
) {
  const activeHabits = getActiveHabits(habits);
  const monthKeys = new Set(getMonthKeys(month));

  return activeHabits
    .map((habit) => ({
      name: habit.title,
      value: completions.filter(
        (completion) =>
          completion.habitId === habit.id && monthKeys.has(completion.dateKey),
      ).length,
      color: habit.color ?? "#8f2eff",
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
}
