export type HabitCategory =
  | "Health"
  | "Mindset"
  | "Productivity"
  | "Learning"
  | "Lifestyle"
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
