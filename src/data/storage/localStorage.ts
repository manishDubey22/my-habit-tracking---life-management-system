import { createStorage } from "./storage";

const KEY_TASKS = "routineTasks";
const KEY_COMPLETIONS = "taskCompletions";

export const appStorage = createStorage(
  typeof localStorage !== "undefined" ? localStorage : ({} as Storage),
);

export const storageKeys = { KEY_TASKS, KEY_COMPLETIONS } as const;
