import type { TaskCompletion } from "../models/TaskCompletion";

/** Check if task is completed on date (completion exists with done=true). */
export function isCompleted(
  completions: TaskCompletion[],
  taskId: string,
  date: string,
): boolean {
  return completions.some(
    (c) => c.taskId === taskId && c.date === date && c.done,
  );
}

/** Count completed tasks on date (from visible task ids). */
export function completedCount(
  completions: TaskCompletion[],
  visibleTaskIds: string[],
  date: string,
): number {
  const set = new Set(
    completions.filter((c) => c.date === date && c.done).map((c) => c.taskId),
  );
  return visibleTaskIds.filter((id) => set.has(id)).length;
}
