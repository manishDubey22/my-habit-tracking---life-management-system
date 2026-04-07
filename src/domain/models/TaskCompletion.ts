/** Completion record for one task on one date. Remove record when unchecked (MVP). */
export interface TaskCompletion {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  done: boolean;
  note?: string;
  completedAt?: string; // ISO timestamp for audits/streaks
}
