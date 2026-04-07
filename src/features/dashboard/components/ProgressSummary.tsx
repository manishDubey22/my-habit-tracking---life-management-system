interface ProgressSummaryProps {
  completed: number;
  total: number;
  progressPct: number;
  selectedDate: string;
}

export function ProgressSummary({
  completed,
  total,
  progressPct,
  selectedDate,
}: ProgressSummaryProps) {
  if (total === 0) {
    return (
      <div className="progress-summary">
        <p>No tasks scheduled for {selectedDate}.</p>
      </div>
    );
  }

  return (
    <div className="progress-summary">
      <p>
        Completed <strong>{completed}</strong> / <strong>{total}</strong> tasks
        — <strong>{progressPct}%</strong>
      </p>
    </div>
  );
}
