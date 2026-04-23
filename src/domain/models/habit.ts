export type HabitCategory =
  | "Health"
  | "Fitness"
  | "Learning"
  | "Personal"
  | "Work"
  | "Social"
  | "Mindfulness"
  | "Other";

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  monthlyGoal: number;
  color?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
