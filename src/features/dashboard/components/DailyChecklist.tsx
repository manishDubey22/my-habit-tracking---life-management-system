import type { RoutineTask } from "../../../domain/models/RoutineTask";

interface DailyChecklistProps {
  tasks: RoutineTask[];
  isTaskDone: (taskId: string) => boolean;
  onToggle: (taskId: string, done: boolean) => void;
}

export function DailyChecklist({
  tasks,
  isTaskDone,
  onToggle,
}: DailyChecklistProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks scheduled for this day.</p>;
  }

  return (
    <ul className="daily-checklist">
      {tasks.map((t) => {
        const done = isTaskDone(t.id);
        return (
          <li key={t.id} className="checklist-item">
            <label className="checklist-row">
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggle(t.id, !done)}
              />
              <span className={done ? "done" : ""}>{t.title}</span>
              {t.time && <span className="task-time">{t.time}</span>}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
