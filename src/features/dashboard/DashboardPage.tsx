import { useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "./hooks/useDashboardData";
import { DailyChecklist } from "./components/DailyChecklist";
import { ProgressSummary } from "./components/ProgressSummary";
import { ProgressChart } from "./components/ProgressChart";
import { useAppStore } from "../../store/AppStore";
import { today, addDays } from "../../domain/utils/date";

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(today());
  const { setCompletion } = useAppStore();
  const {
    visibleTasks,
    completed,
    total,
    progressPct,
    isTaskDone,
    getProgressSeries,
  } = useDashboardData(selectedDate);

  const handleToggle = (taskId: string, done: boolean) => {
    setCompletion(taskId, selectedDate, done);
  };

  const prevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const nextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const isToday = selectedDate === today();

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <nav>
          <Link to="/tasks">Tasks Manager</Link>
        </nav>
      </header>

      <div className="date-picker-bar">
        <button type="button" onClick={prevDay} aria-label="Previous day">
          ←
        </button>
        <label className="date-display">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {isToday && <span className="today-badge">Today</span>}
        </label>
        <button type="button" onClick={nextDay} aria-label="Next day">
          →
        </button>
      </div>

      <section className="daily-section">
        <h2>Daily checklist</h2>
        <DailyChecklist
          tasks={visibleTasks}
          isTaskDone={isTaskDone}
          onToggle={handleToggle}
        />
      </section>

      <section className="progress-section">
        <ProgressSummary
          completed={completed}
          total={total}
          progressPct={progressPct}
          selectedDate={selectedDate}
        />
      </section>

      <section className="chart-section">
        <ProgressChart getProgressSeries={getProgressSeries} />
      </section>
    </div>
  );
}
