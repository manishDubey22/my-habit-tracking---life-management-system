import type { HabitCategory } from "../../domain/models/habit";

export const habitCategories: HabitCategory[] = [
  "Health",
  "Fitness",
  "Learning",
  "Personal",
  "Work",
  "Social",
  "Mindfulness",
  "Other",
];

export const habitColorOptions = [
  "#8f2eff",
  "#ec4899",
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#8b5cf6",
] as const;
