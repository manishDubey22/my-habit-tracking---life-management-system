import { Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { CompletionMap } from "../../../domain/models/completion";
import { isHabitCompleted } from "../../../domain/calculations/progress";
import { getWeekStartMondayKey } from "../../../domain/calculations/weekly";
import type { Habit } from "../../../domain/models/habit";

interface HabitMonthGridProps {
  habits: Habit[];
  completions: CompletionMap;
  dateKeys: string[];
  onToggle: (habitId: string, dateKey: string) => void;
}

const HABIT_COLUMN_WIDTH = 240;
const DAY_COLUMN_WIDTH = 52;

const weekBands = [
  {
    background: "rgba(159, 187, 224, 0.22)",
    backgroundStrong: "rgba(159, 187, 224, 0.3)",
    text: "#355d8f",
  },
  {
    background: "rgba(192, 168, 221, 0.24)",
    backgroundStrong: "rgba(192, 168, 221, 0.34)",
    text: "#6f43a6",
  },
] as const;

export function HabitMonthGrid({
  habits,
  completions,
  dateKeys,
  onToggle,
}: HabitMonthGridProps) {
  const gridTemplateColumns = `${HABIT_COLUMN_WIDTH}px repeat(${dateKeys.length}, ${DAY_COLUMN_WIDTH}px)`;
  const weekStartOrder = Array.from(
    new Set(dateKeys.map(getWeekStartMondayKey)),
  );
  const weekIndexByStart = new Map(
    weekStartOrder.map((weekStart, index) => [weekStart, index]),
  );

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,
        }}
      >
        <Box
          sx={{
            minWidth: HABIT_COLUMN_WIDTH + dateKeys.length * DAY_COLUMN_WIDTH,
            display: "grid",
            gridTemplateColumns,
            gap: 0.75,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              left: 0,
              zIndex: 3,
              px: 1.5,
              py: 1.5,
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem" }}>
              Habits
            </Typography>
          </Box>

          {dateKeys.map((dateKey, index) => {
            const weekIndex =
              weekIndexByStart.get(getWeekStartMondayKey(dateKey)) ?? 0;
            const band = weekBands[weekIndex % weekBands.length];
            const isWeekStart = index === 0 || dayjs(dateKey).day() === 1;

            return (
              <Box
                key={dateKey}
                sx={{
                  py: 1,
                  minHeight: 64,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.25,
                  borderRadius: 2,
                  backgroundColor: band.backgroundStrong,
                  borderLeft: isWeekStart
                    ? "2px solid rgba(38, 37, 30, 0.12)"
                    : "none",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: band.text, fontWeight: 600 }}
                >
                  {dayjs(dateKey).format("ddd")}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontSize: "1rem", color: band.text }}
                >
                  {dayjs(dateKey).format("D")}
                </Typography>
              </Box>
            );
          })}

          {habits.map((habit) => (
            <Box key={habit.id} sx={{ display: "contents" }}>
              <Box
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  px: 1.5,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  minHeight: 54,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "999px",
                    backgroundColor: habit.color ?? "secondary.main",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "0.98rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {habit.title}
                </Typography>
              </Box>

              {dateKeys.map((dateKey, index) => {
                const checked = isHabitCompleted(
                  completions,
                  habit.id,
                  dateKey,
                );
                const weekIndex =
                  weekIndexByStart.get(getWeekStartMondayKey(dateKey)) ?? 0;
                const band = weekBands[weekIndex % weekBands.length];
                const isWeekStart = index === 0 || dayjs(dateKey).day() === 1;

                return (
                  <Box
                    key={`${habit.id}-${dateKey}`}
                    component="button"
                    type="button"
                    onClick={() => onToggle(habit.id, dateKey)}
                    sx={{
                      width: DAY_COLUMN_WIDTH,
                      height: 44,
                      borderRadius: 1.75,
                      border: "1.5px solid",
                      borderColor: checked
                        ? (habit.color ?? "secondary.main")
                        : "rgba(38, 37, 30, 0.12)",
                      backgroundColor: checked
                        ? `${habit.color ?? "#8f2eff"}18`
                        : band.background,
                      color: habit.color ?? "secondary.main",
                      boxShadow: isWeekStart
                        ? "inset 2px 0 0 rgba(38, 37, 30, 0.1)"
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition:
                        "transform 160ms ease, background-color 160ms ease, border-color 160ms ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        borderColor: habit.color ?? "secondary.main",
                        backgroundColor: checked
                          ? `${habit.color ?? "#8f2eff"}22`
                          : band.backgroundStrong,
                      },
                    }}
                  >
                    {checked ? (
                      <Typography sx={{ fontSize: "1rem", lineHeight: 1 }}>
                        {"\u2713"}
                      </Typography>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
