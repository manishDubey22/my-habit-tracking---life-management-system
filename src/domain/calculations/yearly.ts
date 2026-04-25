import dayjs from "dayjs";
import type { CompletionMap } from "../models/completion";
import type { Habit } from "../models/habit";
import { completionKey } from "../../utils/date";

export interface YearMonthProgress {
  monthIndex: number;
  month: string;
  value: number;
  completed: number;
  totalPossible: number;
  hasData: boolean;
}

export interface YearSummary {
  totalHabits: number;
  totalCompletions: number;
  avgConsistency: number;
  bestMonth: { month: string; value: number };
  worstMonth: { month: string; value: number };
}

export interface HabitYearStat {
  id: string;
  name: string;
  color: string;
  category: Habit["category"];
  totalCompletions: number;
  consistency: number;
  rank: number;
  badge?: string;
}

export interface MonthlyTrendData {
  month: string;
  value: number;
}

export interface CategoryYearData {
  category: Habit["category"];
  completed: number;
  total: number;
  percentage: number;
}

export interface YearComparisonResult {
  yearA: number;
  yearB: number;
  delta: number;
  data: Array<{
    month: string;
    yearA: number;
    yearB: number;
  }>;
}

export interface HabitTrendPoint {
  month: string;
  value: number;
}

export interface HabitTrend {
  habitId: string;
  habitName: string;
  color: string;
  data: HabitTrendPoint[];
}

function getYearWindow(year: number) {
  const start = dayjs().year(year).startOf("year");
  const currentYear = dayjs().year();

  if (year > currentYear) {
    return {
      start,
      end: start.subtract(1, "day"),
      hasDataWindow: false,
    };
  }

  return {
    start,
    end: year === currentYear ? dayjs().endOf("day") : start.endOf("year"),
    hasDataWindow: true,
  };
}

function getHabitWindowForMonth(
  habit: Habit,
  year: number,
  monthIndex: number,
) {
  const monthStart = dayjs().year(year).month(monthIndex).startOf("month");
  const monthEnd = monthStart.endOf("month");
  const { end: yearEnd, hasDataWindow } = getYearWindow(year);
  const createdAt = dayjs(habit.createdAt).startOf("day");
  const effectiveStart = createdAt.isAfter(monthStart) ? createdAt : monthStart;
  const effectiveEnd = yearEnd.isBefore(monthEnd) ? yearEnd : monthEnd;

  if (!hasDataWindow || effectiveStart.isAfter(effectiveEnd, "day")) {
    return null;
  }

  return { start: effectiveStart, end: effectiveEnd };
}

function getHabitWindowForYear(habit: Habit, year: number) {
  const { start: yearStart, end: yearEnd, hasDataWindow } = getYearWindow(year);
  const createdAt = dayjs(habit.createdAt).startOf("day");
  const effectiveStart = createdAt.isAfter(yearStart) ? createdAt : yearStart;

  if (!hasDataWindow || effectiveStart.isAfter(yearEnd, "day")) {
    return null;
  }

  return { start: effectiveStart, end: yearEnd };
}

function countCompletionsBetween(
  completions: CompletionMap,
  habitId: string,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
) {
  let completed = 0;
  let cursor = start.startOf("day");

  while (!cursor.isAfter(end, "day")) {
    if (completions[completionKey(habitId, cursor.format("YYYY-MM-DD"))]) {
      completed += 1;
    }
    cursor = cursor.add(1, "day");
  }

  return completed;
}

export function getMonthlyProgress(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): YearMonthProgress[] {
  const activeHabits = habits.filter((habit) => habit.active);

  return Array.from({ length: 12 }, (_, monthIndex) => {
    const monthLabel = dayjs().month(monthIndex).format("MMM");

    const stats = activeHabits.reduce(
      (acc, habit) => {
        const window = getHabitWindowForMonth(habit, year, monthIndex);
        if (!window) return acc;

        const availableDays = window.end.diff(window.start, "day") + 1;
        const completed = countCompletionsBetween(
          completions,
          habit.id,
          window.start,
          window.end,
        );

        acc.totalPossible += availableDays;
        acc.completed += completed;
        return acc;
      },
      { completed: 0, totalPossible: 0 },
    );

    return {
      monthIndex,
      month: monthLabel,
      value:
        stats.totalPossible === 0
          ? 0
          : Math.round((stats.completed / stats.totalPossible) * 100),
      completed: stats.completed,
      totalPossible: stats.totalPossible,
      hasData: stats.totalPossible > 0,
    };
  });
}

export function getYearSummary(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): YearSummary {
  const activeHabits = habits.filter(
    (habit) => habit.active && getHabitWindowForYear(habit, year),
  );
  const monthly = getMonthlyProgress(year, activeHabits, completions);

  const totalCompletions = monthly.reduce(
    (sum, month) => sum + month.completed,
    0,
  );
  const totalPossible = monthly.reduce(
    (sum, month) => sum + month.totalPossible,
    0,
  );
  const avgConsistency =
    totalPossible === 0
      ? 0
      : Math.round((totalCompletions / totalPossible) * 100);

  const monthsWithData = monthly.filter((month) => month.hasData);
  const bestMonth = monthsWithData.reduce(
    (best, month) => (month.value > best.value ? month : best),
    monthsWithData[0] ?? { month: "-", value: 0 },
  ) ?? { month: "-", value: 0 };
  const worstMonth = monthsWithData.reduce(
    (worst, month) => (month.value < worst.value ? month : worst),
    monthsWithData[0] ?? { month: "-", value: 0 },
  ) ?? { month: "-", value: 0 };

  return {
    totalHabits: activeHabits.length,
    totalCompletions,
    avgConsistency,
    bestMonth: { month: bestMonth.month, value: bestMonth.value },
    worstMonth: { month: worstMonth.month, value: worstMonth.value },
  };
}

export function getTopHabitsYear(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): HabitYearStat[] {
  const activeHabits = habits.filter(
    (habit) => habit.active && getHabitWindowForYear(habit, year),
  );

  const ranked = activeHabits
    .map((habit, index) => {
      const window = getHabitWindowForYear(habit, year);
      if (!window) return null;

      const totalPossible = window.end.diff(window.start, "day") + 1;
      const totalCompletions = countCompletionsBetween(
        completions,
        habit.id,
        window.start,
        window.end,
      );
      const consistency =
        totalPossible === 0
          ? 0
          : Math.round((totalCompletions / totalPossible) * 100);

      return {
        id: habit.id,
        name: habit.title,
        color: habit.color ?? "#8f2eff",
        category: habit.category,
        totalCompletions,
        consistency,
        rank: 0,
        sortIndex: index,
      };
    })
    .filter((habit): habit is NonNullable<typeof habit> => habit !== null)
    .sort((left, right) => {
      if (right.consistency !== left.consistency) {
        return right.consistency - left.consistency;
      }
      if (right.totalCompletions !== left.totalCompletions) {
        return right.totalCompletions - left.totalCompletions;
      }
      return left.sortIndex - right.sortIndex;
    })
    .map((habit, index) => ({
      ...habit,
      rank: index + 1,
      badge:
        index === 0
          ? "Most consistent"
          : index === 1
            ? "High performer"
            : index === 2
              ? "Most active"
              : undefined,
    }));

  return ranked;
}

export function getMonthlyTrend(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): MonthlyTrendData[] {
  return getMonthlyProgress(year, habits, completions).map((month) => ({
    month: month.month,
    value: month.value,
  }));
}

export function getCategoryYearlyProgress(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): CategoryYearData[] {
  const activeHabits = habits.filter(
    (habit) => habit.active && getHabitWindowForYear(habit, year),
  );
  const categories = Array.from(
    new Set(activeHabits.map((habit) => habit.category)),
  );

  return categories
    .map((category) => {
      const categoryHabits = activeHabits.filter(
        (habit) => habit.category === category,
      );

      const stats = categoryHabits.reduce(
        (acc, habit) => {
          const window = getHabitWindowForYear(habit, year);
          if (!window) return acc;

          const total = window.end.diff(window.start, "day") + 1;
          const completed = countCompletionsBetween(
            completions,
            habit.id,
            window.start,
            window.end,
          );

          acc.total += total;
          acc.completed += completed;
          return acc;
        },
        { completed: 0, total: 0 },
      );

      return {
        category,
        completed: stats.completed,
        total: stats.total,
        percentage:
          stats.total === 0
            ? 0
            : Math.round((stats.completed / stats.total) * 100),
      };
    })
    .sort((left, right) => right.percentage - left.percentage);
}

export function getYearComparison(
  yearA: number,
  yearB: number,
  habits: Habit[],
  completions: CompletionMap,
): YearComparisonResult {
  const trendA = getMonthlyTrend(yearA, habits, completions);
  const trendB = getMonthlyTrend(yearB, habits, completions);
  const summaryA = getYearSummary(yearA, habits, completions);
  const summaryB = getYearSummary(yearB, habits, completions);

  return {
    yearA,
    yearB,
    delta: summaryB.avgConsistency - summaryA.avgConsistency,
    data: trendA.map((month, index) => ({
      month: month.month,
      yearA: month.value,
      yearB: trendB[index]?.value ?? 0,
    })),
  };
}

export function getHabitTrendTimeline(
  year: number,
  habits: Habit[],
  completions: CompletionMap,
): HabitTrend[] {
  const activeHabits = habits.filter(
    (habit) => habit.active && getHabitWindowForYear(habit, year),
  );

  return activeHabits.map((habit) => {
    const data = Array.from({ length: 12 }, (_, monthIndex) => {
      const month = dayjs().month(monthIndex).format("MMM");
      const window = getHabitWindowForMonth(habit, year, monthIndex);

      if (!window) {
        return { month, value: 0 };
      }

      const total = window.end.diff(window.start, "day") + 1;
      const completed = countCompletionsBetween(
        completions,
        habit.id,
        window.start,
        window.end,
      );

      return {
        month,
        value: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    });

    return {
      habitId: habit.id,
      habitName: habit.title,
      color: habit.color ?? "#8f2eff",
      data,
    };
  });
}
