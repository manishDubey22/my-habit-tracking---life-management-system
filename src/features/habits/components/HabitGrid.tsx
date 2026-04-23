import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useHabitStore } from "../../../store/useHabitStore";
import { monthRangeKeys } from "../../../utils/date";

export function HabitGrid() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const activeHabits = useMemo(
    () => habits.filter((habit) => habit.active),
    [habits],
  );

  const today = dayjs();
  const dateKeys = useMemo(
    () => monthRangeKeys(today.year(), today.month()),
    [today],
  );

  if (activeHabits.length === 0) {
    return <Typography color="text.secondary">No habits yet.</Typography>;
  }

  return (
    <div className="overflow-x-auto">
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Habit</TableCell>
            {dateKeys.map((dateKey) => (
              <TableCell key={dateKey} align="center">
                {dayjs(dateKey).date()}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {activeHabits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell>{habit.title}</TableCell>
              {dateKeys.map((dateKey) => {
                const checked = completions.some(
                  (c) => c.habitId === habit.id && c.dateKey === dateKey,
                );
                return (
                  <TableCell key={`${habit.id}-${dateKey}`} align="center">
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => toggleCompletion(habit.id, dateKey)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
