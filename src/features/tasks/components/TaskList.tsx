import type { RoutineTask } from "../../../domain/models/RoutineTask";

interface TaskListProps {
  tasks: RoutineTask[];
  onEdit: (task: RoutineTask) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        No routine tasks yet. Add one to get started.
      </p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <li key={t.id} className="task-item">
          <div className="task-item-main">
            <span className="task-title">{t.title}</span>
            {t.time && <span className="task-meta">{t.time}</span>}
            {t.durationMin != null && (
              <span className="task-meta">{t.durationMin} min</span>
            )}
            {t.category && <span className="task-category">{t.category}</span>}
          </div>
          <div className="task-item-actions">
            <button type="button" onClick={() => onEdit(t)}>
              Edit
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(t.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
