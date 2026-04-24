import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Habit } from "../domain/models/habit";
import type {
  CompletionMap,
  LegacyCompletion,
} from "../domain/models/completion";
import { completionKey, toDateKey } from "../utils/date";
import { createId } from "../utils/ids";

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
  completions: CompletionMap;
  addHabit: (input: CreateHabitInput) => void;
  updateHabit: (input: UpdateHabitInput) => void;
  deleteHabit: (habitId: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
}

function normalizeCompletions(
  completions: CompletionMap | LegacyCompletion[] | undefined,
) {
  if (!completions) return {};
  if (!Array.isArray(completions)) return completions;

  return completions.reduce<CompletionMap>((acc, completion) => {
    if (completion.completed) {
      acc[completionKey(completion.habitId, completion.dateKey)] = true;
    }
    return acc;
  }, {});
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      completions: {},

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
          const key = completionKey(habitId, dateKey);

          if (state.completions[key]) {
            const nextCompletions = { ...state.completions };
            delete nextCompletions[key];
            return { completions: nextCompletions };
          }

          return {
            completions: {
              ...state.completions,
              [key]: true,
            },
          };
        }),
    }),
    {
      name: "routine-tracker-store",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as {
          habits?: Habit[];
          completions?: CompletionMap | LegacyCompletion[];
        };

        return {
          habits: state?.habits ?? [],
          completions: normalizeCompletions(state?.completions),
        };
      },
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
      }),
    },
  ),
);
