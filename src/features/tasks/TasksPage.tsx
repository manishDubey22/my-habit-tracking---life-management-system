import { useState } from "react";
import { Link } from "react-router-dom";
import { useTasks } from "./hooks/useTasks";
import { TaskForm, type TaskFormData } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import type { RoutineTask } from "../../domain/models/RoutineTask";
import { today } from "../../domain/utils/date";

export function TasksPage() {
  const { tasks, createTask, update, remove } = useTasks();
  const [editing, setEditing] = useState<RoutineTask | null>(null);
  const [showForm, setShowForm] = useState(false);

  const defaultStartDate = today();

  const handleSave = (data: TaskFormData) => {
    if (editing) {
      update({
        ...editing,
        ...data,
      });
      setEditing(null);
    } else {
      createTask(data);
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="page tasks-page">
      <header className="page-header">
        <h1>Tasks Manager</h1>
        <nav>
          <Link to="/">Dashboard</Link>
        </nav>
      </header>

      {showForm && !editing ? (
        <TaskForm
          defaultStartDate={defaultStartDate}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : editing ? (
        <TaskForm
          initial={editing}
          defaultStartDate={defaultStartDate}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <button
          type="button"
          className="primary"
          onClick={() => setShowForm(true)}
        >
          Add Task
        </button>
      )}

      <TaskList
        tasks={tasks}
        onEdit={(t) => {
          setEditing(t);
          setShowForm(false);
        }}
        onDelete={remove}
      />
    </div>
  );
}
