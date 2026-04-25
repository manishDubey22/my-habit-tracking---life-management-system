import type { Dayjs } from "dayjs";
import type { CompletionMap } from "../models/completion";
import type { Habit } from "../models/habit";
import { completionKey, monthRangeKeys } from "../../utils/date";

export interface SummaryMetric {
  label: string;
  value: string;
  tone: "violet" | "pink" | "blue" | "amber" | "green";
  progress?: number;
}

export function getActiveHabits(habits: Habit[]) {
  return habits.filter((habit) => habit.active);
}

export function getMonthDateKeys(month: Dayjs) {
  return monthRangeKeys(month.year(), month.month());
}

export function isHabitCompleted(
  completions: CompletionMap,
  habitId: string,
  dateKey: string,
) {
  return Boolean(completions[completionKey(habitId, dateKey)]);
}

export function getDailyProgress(
  dateKey: string,
  habits: Habit[],
  completions: CompletionMap,
) {
  const activeHabits = getActiveHabits(habits);
  const completed = activeHabits.filter((habit) =>
    isHabitCompleted(completions, habit.id, dateKey),
  ).length;
  const total = activeHabits.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, progress };
}

export function buildDailyProgressSeries(
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
) {
  return getMonthDateKeys(month).map((dateKey) => {
    const daily = getDailyProgress(dateKey, habits, completions);
    return {
      day: Number(dateKey.slice(-2)),
      completed: daily.completed,
      remaining: Math.max(0, daily.total - daily.completed),
      progress: daily.progress,
      dateLabel: dateKey,
    };
  });
}

export function getHabitScore(
  habitId: string,
  dateKeys: string[],
  completions: CompletionMap,
) {
  if (dateKeys.length === 0) return 0;

  const completed = dateKeys.filter((dateKey) =>
    isHabitCompleted(completions, habitId, dateKey),
  ).length;

  return Math.round((completed / dateKeys.length) * 100);
}

export function buildTopHabits(
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
) {
  const activeHabits = getActiveHabits(habits);
  const dateKeys = getMonthDateKeys(month);

  return activeHabits
    .map((habit) => {
      const completedDays = dateKeys.filter((dateKey) =>
        isHabitCompleted(completions, habit.id, dateKey),
      ).length;
      const score = getHabitScore(habit.id, dateKeys, completions);

      return {
        id: habit.id,
        name: habit.title,
        category: habit.category,
        goal: habit.monthlyGoal,
        completedDays,
        score,
        color: habit.color ?? "#8f2eff",
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score || right.completedDays - left.completedDays,
    );
}

export function buildSummaryMetrics(
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
): SummaryMetric[] {
  const activeHabits = getActiveHabits(habits);
  const dateKeys = getMonthDateKeys(month);
  const totalSlots = activeHabits.length * dateKeys.length;
  const completionCount = dateKeys.reduce((sum, dateKey) => {
    return sum + getDailyProgress(dateKey, activeHabits, completions).completed;
  }, 0);
  const completionRate =
    totalSlots === 0 ? 0 : Math.round((completionCount / totalSlots) * 100);
  const avgDaily =
    dateKeys.length === 0 ? 0 : Math.round(completionCount / dateKeys.length);
  const onTrack = activeHabits.filter((habit) => {
    const completedDays = dateKeys.filter((dateKey) =>
      isHabitCompleted(completions, habit.id, dateKey),
    ).length;

    return completedDays >= Math.min(habit.monthlyGoal, dateKeys.length);
  }).length;

  return [
    {
      label: "Total Habits",
      value: `${activeHabits.length}`,
      tone: "violet",
      progress: activeHabits.length > 0 ? 100 : 0,
    },
    {
      label: "Completions (Month)",
      value: `${completionCount}`,
      tone: "pink",
      progress: completionRate,
    },
    {
      label: "Avg Daily",
      value: `${avgDaily}`,
      tone: "blue",
      progress:
        activeHabits.length === 0
          ? 0
          : Math.min(100, Math.round((avgDaily / activeHabits.length) * 100)),
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      tone: "amber",
      progress: completionRate,
    },
    {
      label: "On Track",
      value: `${onTrack}/${activeHabits.length || 0}`,
      tone: "green",
      progress:
        activeHabits.length === 0
          ? 0
          : Math.round((onTrack / activeHabits.length) * 100),
    },
  ];
}
