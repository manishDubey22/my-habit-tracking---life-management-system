import { useCallback } from "react";
import { useAppStore } from "../../../store/AppStore";
import type { RoutineTask } from "../../../domain/models/RoutineTask";
import type { TaskCategory } from "../../../domain/models/RoutineTask";

export function useTasks() {
  const { tasks, addTask, updateTask, softDeleteTask } = useAppStore();

  const activeTasks = tasks.filter((t) => t.active);

  const createTask = useCallback(
    (input: {
      title: string;
      time?: string;
      durationMin?: number;
      category?: TaskCategory;
      startDate: string;
      endDate?: string;
    }) => {
      const maxOrder = Math.max(0, ...tasks.map((t) => t.orderIndex));
      addTask({
        title: input.title,
        time: input.time,
        durationMin: input.durationMin,
        category: input.category,
        active: true,
        startDate: input.startDate,
        endDate: input.endDate,
        frequency: "daily",
        orderIndex: maxOrder + 1,
      });
    },
    [addTask, tasks],
  );

  const update = useCallback(
    (task: RoutineTask) => {
      updateTask({ ...task, updatedAt: new Date().toISOString() });
    },
    [updateTask],
  );

  const remove = useCallback(
    (id: string) => {
      softDeleteTask(id);
    },
    [softDeleteTask],
  );

  return { tasks: activeTasks, allTasks: tasks, createTask, update, remove };
}
