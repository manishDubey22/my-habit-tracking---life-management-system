import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Habit } from "../domain/models/habit";
import type { Completion } from "../domain/models/completion";
import { createId } from "../utils/ids";
import { toDateKey } from "../utils/date";

interface CreateHabitInput {
  title: string;
  category: Habit["category"];
  monthlyGoal: number;
  color?: string;
}

interface UpdateHabitInput extends Partial<CreateHabitInput> {
  id: string;
}

interface HabitState {
  habits: Habit[];
  completions: Completion[];
  addHabit: (input: CreateHabitInput) => void;
  updateHabit: (input: UpdateHabitInput) => void;
  deleteHabit: (habitId: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      completions: [],

      addHabit: (input) =>
        set((state) => {
          const now = new Date().toISOString();
          const habit: Habit = {
            id: createId(),
            title: input.title.trim(),
            category: input.category,
            monthlyGoal: input.monthlyGoal,
            color: input.color,
            active: true,
            createdAt: now,
            updatedAt: now,
          };
          return { habits: [...state.habits, habit] };
        }),

      updateHabit: (input) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === input.id
              ? {
                  ...habit,
                  title: input.title?.trim() ?? habit.title,
                  category: input.category ?? habit.category,
                  monthlyGoal: input.monthlyGoal ?? habit.monthlyGoal,
                  color: input.color ?? habit.color,
                  updatedAt: new Date().toISOString(),
                }
              : habit,
          ),
        })),

      deleteHabit: (habitId) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? { ...habit, active: false, updatedAt: new Date().toISOString() }
              : habit,
          ),
        })),

      toggleCompletion: (habitId, date) =>
        set((state) => {
          const dateKey = toDateKey(date);
          const existing = state.completions.find(
            (c) => c.habitId === habitId && c.dateKey === dateKey,
          );

          if (existing) {
            return {
              completions: state.completions.filter(
                (c) => c.id !== existing.id,
              ),
            };
          }

          const now = new Date().toISOString();
          const completion: Completion = {
            id: createId(),
            habitId,
            dateKey,
            completed: true,
            createdAt: now,
            updatedAt: now,
          };
          return { completions: [...state.completions, completion] };
        }),
    }),
    {
      name: "routine-tracker-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
      }),
    },
  ),
);
