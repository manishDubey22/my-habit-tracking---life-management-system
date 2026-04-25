export type CompletionMap = Record<string, boolean>;

export interface LegacyCompletion {
  id: string;
  habitId: string;
  dateKey: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
