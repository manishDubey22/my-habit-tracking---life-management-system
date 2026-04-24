import dayjs, { type Dayjs } from "dayjs";
import type { CompletionMap } from "../models/completion";
import type { Habit } from "../models/habit";
import {
  getActiveHabits,
  getMonthDateKeys,
  isHabitCompleted,
} from "./progress";

export interface WeekProgress {
  key: string;
  label: string;
  shortLabel: string;
  dateKeys: string[];
  completed: number;
  total: number;
  progress: number;
}

export function getWeekStartMondayKey(dateKey: string) {
  const date = dayjs(dateKey);
  const mondayOffset = (date.day() + 6) % 7;
  return date.subtract(mondayOffset, "day").format("YYYY-MM-DD");
}

export function getMonthWeekGroups(month: Dayjs) {
  const dateKeys = getMonthDateKeys(month);
  const groups = new Map<string, string[]>();

  dateKeys.forEach((dateKey) => {
    const weekKey = getWeekStartMondayKey(dateKey);
    const current = groups.get(weekKey) ?? [];
    current.push(dateKey);
    groups.set(weekKey, current);
  });

  return Array.from(groups.entries()).map(([key, weekDateKeys], index) => {
    const start = dayjs(weekDateKeys[0]);
    const end = dayjs(weekDateKeys[weekDateKeys.length - 1]);

    return {
      index,
      key,
      label: `${start.format("MMM D")} - ${end.format("MMM D")}`,
      shortLabel: `Week ${index + 1}`,
      dateKeys: weekDateKeys,
    };
  });
}

export function getWeeklyProgress(
  weekDateKeys: string[],
  habits: Habit[],
  completions: CompletionMap,
) {
  const activeHabits = getActiveHabits(habits);
  const total = activeHabits.length * weekDateKeys.length;
  const completed = weekDateKeys.reduce((sum, dateKey) => {
    return (
      sum +
      activeHabits.filter((habit) =>
        isHabitCompleted(completions, habit.id, dateKey),
      ).length
    );
  }, 0);

  return {
    completed,
    total,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function buildWeeklyProgressSeries(
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
): WeekProgress[] {
  return getMonthWeekGroups(month).map((week) => {
    const progress = getWeeklyProgress(week.dateKeys, habits, completions);

    return {
      key: week.key,
      label: week.label,
      shortLabel: week.shortLabel,
      dateKeys: week.dateKeys,
      completed: progress.completed,
      total: progress.total,
      progress: progress.progress,
    };
  });
}
