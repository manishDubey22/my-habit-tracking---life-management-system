/** Typed localStorage wrapper. */
export interface StorageAdapter {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

export function createStorage(storage: globalThis.Storage): StorageAdapter {
  return {
    getItem<T>(key: string): T | null {
      try {
        const raw = storage.getItem(key);
        if (raw == null) return null;
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    setItem<T>(key: string, value: T): void {
      storage.setItem(key, JSON.stringify(value));
    },
    removeItem(key: string): void {
      storage.removeItem(key);
    },
  };
}
