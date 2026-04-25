import type { Dayjs } from "dayjs";
import type { CompletionMap } from "../models/completion";
import type { Habit, HabitCategory } from "../models/habit";
import {
  getActiveHabits,
  getMonthDateKeys,
  isHabitCompleted,
} from "./progress";

export interface CategoryProgress {
  category: HabitCategory;
  completed: number;
  remaining: number;
  progress: number;
}

export function getCategoryProgress(
  category: HabitCategory,
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
): CategoryProgress {
  const categoryHabits = getActiveHabits(habits).filter(
    (habit) => habit.category === category,
  );
  const dateKeys = getMonthDateKeys(month);
  const total = categoryHabits.length * dateKeys.length;
  const completed = dateKeys.reduce((sum, dateKey) => {
    return (
      sum +
      categoryHabits.filter((habit) =>
        isHabitCompleted(completions, habit.id, dateKey),
      ).length
    );
  }, 0);

  return {
    category,
    completed,
    remaining: Math.max(0, total - completed),
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function buildCategoryProgressSeries(
  month: Dayjs,
  habits: Habit[],
  completions: CompletionMap,
) {
  const categories = Array.from(
    new Set(getActiveHabits(habits).map((habit) => habit.category)),
  );

  return categories
    .map((category) =>
      getCategoryProgress(category, month, habits, completions),
    )
    .sort((left, right) => right.progress - left.progress);
}
