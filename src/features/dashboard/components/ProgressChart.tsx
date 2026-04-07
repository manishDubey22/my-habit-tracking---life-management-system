import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartPoint {
  date: string;
  pct: number;
  label: string;
}

interface ProgressChartProps {
  getProgressSeries: (days: 7 | 30) => ChartPoint[];
}

export function ProgressChart({ getProgressSeries }: ProgressChartProps) {
  const [days, setDays] = useState<7 | 30>(7);
  const data = useMemo(
    () => getProgressSeries(days),
    [getProgressSeries, days],
  );

  return (
    <div className="progress-chart">
      <div className="chart-header">
        <h3>Daily completion %</h3>
        <div className="chart-toggle">
          <button
            type="button"
            className={days === 7 ? "active" : ""}
            onClick={() => setDays(7)}
          >
            7 days
          </button>
          <button
            type="button"
            className={days === 30 ? "active" : ""}
            onClick={() => setDays(30)}
          >
            30 days
          </button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value, name) =>
                value != null ? [`${String(value)}%`, name] : ["—", name]
              }
              labelFormatter={(_, payload) => payload?.[0]?.payload?.date ?? ""}
            />
            <Bar dataKey="pct" name="Completion" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.pct === 100 ? "#4ade80" : "#60a5fa"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
