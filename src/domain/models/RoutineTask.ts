/** Task category (MVP). */
export type TaskCategory = "Morning" | "Work" | "Health" | "Learning" | "Other";

/** Frequency: MVP only "daily". */
export type TaskFrequency = "daily";

/** Routine task definition. Soft delete via active=false. */
export interface RoutineTask {
  id: string;
  title: string;
  time?: string; // e.g. "05:00"
  durationMin?: number;
  category?: TaskCategory;
  active: boolean;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD, optional
  frequency: TaskFrequency;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}
