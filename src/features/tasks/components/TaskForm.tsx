import { useState } from "react";
import type { RoutineTask } from "../../../domain/models/RoutineTask";
import type { TaskCategory } from "../../../domain/models/RoutineTask";

const CATEGORIES: TaskCategory[] = [
  "Morning",
  "Work",
  "Health",
  "Learning",
  "Other",
];

interface TaskFormProps {
  initial?: RoutineTask | null;
  defaultStartDate: string;
  onSave: (data: TaskFormData) => void;
  onCancel: () => void;
}

export interface TaskFormData {
  title: string;
  time?: string;
  durationMin?: number;
  category?: TaskCategory;
  startDate: string;
  endDate?: string;
}

export function TaskForm({
  initial,
  defaultStartDate,
  onSave,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [durationMin, setDurationMin] = useState(
    initial?.durationMin ?? undefined,
  );
  const [category, setCategory] = useState<TaskCategory | "">(
    initial?.category ?? "",
  );
  const [startDate, setStartDate] = useState(
    initial?.startDate ?? defaultStartDate,
  );
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      time: time.trim() || undefined,
      durationMin: durationMin ?? undefined,
      category: category || undefined,
      startDate,
      endDate: endDate.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-row">
        <label>
          Title *
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Wake up"
            autoFocus
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Time
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <label>
          Duration (min)
          <input
            type="number"
            min={0}
            value={durationMin ?? ""}
            onChange={(e) =>
              setDurationMin(
                e.target.value ? parseInt(e.target.value, 10) : undefined,
              )
            }
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory | "")}
          >
            <option value="">—</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Start date *
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" disabled={!title.trim()}>
          {initial ? "Update" : "Add"} task
        </button>
      </div>
    </form>
  );
}
