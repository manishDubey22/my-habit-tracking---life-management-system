import type { RoutineTask } from "../models/RoutineTask";
import { compareDates } from "../utils/date";

/**
 * Task is visible on date D if: active, startDate <= D, (endDate optional D <= endDate), frequency includes D.
 * MVP: frequency is always "daily" => always true.
 */
export function isTaskVisibleOnDate(task: RoutineTask, date: string): boolean {
  if (!task.active) return false;
  if (compareDates(task.startDate, date) > 0) return false;
  if (task.endDate != null && compareDates(date, task.endDate) > 0)
    return false;
  if (task.frequency !== "daily") return false;
  return true;
}

/** Get tasks that should appear on date D. */
export function getTasksForDate(
  tasks: RoutineTask[],
  date: string,
): RoutineTask[] {
  return tasks
    .filter((t) => isTaskVisibleOnDate(t, date))
    .sort((a, b) => a.orderIndex - b.orderIndex);
}
