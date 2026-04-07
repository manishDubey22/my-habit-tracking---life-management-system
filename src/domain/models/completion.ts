export interface Completion {
  id: string;
  habitId: string;
  dateKey: string; // YYYY-MM-DD local day key
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
