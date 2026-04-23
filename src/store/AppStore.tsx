/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type { RoutineTask } from "../domain/models/RoutineTask";
import type { TaskCompletion } from "../domain/models/TaskCompletion";
import { appStorage, storageKeys } from "../data/storage/localStorage";
import { generateId } from "../domain/utils/ids";

// --- State
export interface AppState {
  tasks: RoutineTask[];
  completions: TaskCompletion[];
}

const initialState: AppState = {
  tasks: [],
  completions: [],
};

// --- Actions
type TaskAction =
  | { type: "TASKS_LOAD"; payload: RoutineTask[] }
  | { type: "TASK_ADD"; payload: RoutineTask }
  | { type: "TASK_UPDATE"; payload: RoutineTask }
  | { type: "TASK_SOFT_DELETE"; payload: string }; // set active=false

type CompletionAction =
  | { type: "COMPLETIONS_LOAD"; payload: TaskCompletion[] }
  | { type: "COMPLETION_SET"; payload: TaskCompletion }
  | { type: "COMPLETION_REMOVE"; payload: { taskId: string; date: string } };

export type AppAction = TaskAction | CompletionAction;

function taskReducer(state: RoutineTask[], action: TaskAction): RoutineTask[] {
  switch (action.type) {
    case "TASKS_LOAD":
      return action.payload;
    case "TASK_ADD":
      return [...state, action.payload];
    case "TASK_UPDATE": {
      const i = state.findIndex((t) => t.id === action.payload.id);
      if (i < 0) return state;
      const next = [...state];
      next[i] = action.payload;
      return next;
    }
    case "TASK_SOFT_DELETE": {
      return state.map((t) =>
        t.id === action.payload
          ? { ...t, active: false, updatedAt: new Date().toISOString() }
          : t,
      );
    }
    default:
      return state;
  }
}

function completionReducer(
  state: TaskCompletion[],
  action: CompletionAction,
): TaskCompletion[] {
  switch (action.type) {
    case "COMPLETIONS_LOAD":
      return action.payload;
    case "COMPLETION_SET": {
      const without = state.filter(
        (c) =>
          !(
            c.taskId === action.payload.taskId && c.date === action.payload.date
          ),
      );
      return [...without, action.payload];
    }
    case "COMPLETION_REMOVE":
      return state.filter(
        (c) =>
          !(
            c.taskId === action.payload.taskId && c.date === action.payload.date
          ),
      );
    default:
      return state;
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TASKS_LOAD":
    case "TASK_ADD":
    case "TASK_UPDATE":
    case "TASK_SOFT_DELETE":
      return {
        ...state,
        tasks: taskReducer(state.tasks, action as TaskAction),
      };
    case "COMPLETIONS_LOAD":
    case "COMPLETION_SET":
    case "COMPLETION_REMOVE":
      return {
        ...state,
        completions: completionReducer(
          state.completions,
          action as CompletionAction,
        ),
      };
    default:
      return state;
  }
}

// --- Context
interface AppStoreValue extends AppState {
  dispatch: React.Dispatch<AppAction>;
  loadFromStorage: () => void;
  persistTasks: (tasks: RoutineTask[]) => void;
  persistCompletions: (completions: TaskCompletion[]) => void;
  addTask: (task: Omit<RoutineTask, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (task: RoutineTask) => void;
  softDeleteTask: (id: string) => void;
  setCompletion: (taskId: string, date: string, done: boolean) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadFromStorage = useCallback(() => {
    const tasks = appStorage.getItem<RoutineTask[]>(storageKeys.KEY_TASKS);
    const completions = appStorage.getItem<TaskCompletion[]>(
      storageKeys.KEY_COMPLETIONS,
    );
    if (tasks) dispatch({ type: "TASKS_LOAD", payload: tasks });
    if (completions)
      dispatch({ type: "COMPLETIONS_LOAD", payload: completions });
  }, []);

  const persistTasks = useCallback((tasks: RoutineTask[]) => {
    appStorage.setItem(storageKeys.KEY_TASKS, tasks);
  }, []);

  const persistCompletions = useCallback((completions: TaskCompletion[]) => {
    appStorage.setItem(storageKeys.KEY_COMPLETIONS, completions);
  }, []);

  const addTask = useCallback(
    (input: Omit<RoutineTask, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const task: RoutineTask = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "TASK_ADD", payload: task });
    },
    [],
  );

  const updateTask = useCallback((task: RoutineTask) => {
    dispatch({ type: "TASK_UPDATE", payload: task });
    // Persist: we need latest state. Use effect in consumer or persist in reducer side-effect. Simpler: persist in a useEffect in provider when state.tasks change.
  }, []);

  const softDeleteTask = useCallback((id: string) => {
    dispatch({ type: "TASK_SOFT_DELETE", payload: id });
  }, []);

  const setCompletion = useCallback(
    (taskId: string, date: string, done: boolean) => {
      if (done) {
        dispatch({
          type: "COMPLETION_SET",
          payload: {
            id: generateId(),
            taskId,
            date,
            done: true,
            completedAt: new Date().toISOString(),
          },
        });
      } else {
        dispatch({ type: "COMPLETION_REMOVE", payload: { taskId, date } });
      }
      // Persist completions after; we'll do it in useEffect so we have latest state
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    appStorage.setItem(storageKeys.KEY_TASKS, state.tasks);
    appStorage.setItem(storageKeys.KEY_COMPLETIONS, state.completions);
  }, [state.tasks, state.completions]);

  const value: AppStoreValue = {
    ...state,
    dispatch,
    loadFromStorage,
    persistTasks,
    persistCompletions,
    addTask,
    updateTask,
    softDeleteTask,
    setCompletion,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
