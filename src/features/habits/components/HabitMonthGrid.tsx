import { Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { Completion } from "../../../domain/models/completion";
import type { Habit } from "../../../domain/models/habit";
import { isHabitCompletedOnDate } from "../lib/habitInsights";

interface HabitMonthGridProps {
  habits: Habit[];
  completions: Completion[];
  dateKeys: string[];
  onToggle: (habitId: string, dateKey: string) => void;
}

const HABIT_COLUMN_WIDTH = 240;
const DAY_COLUMN_WIDTH = 52;

export function HabitMonthGrid({
  habits,
  completions,
  dateKeys,
  onToggle,
}: HabitMonthGridProps) {
  const gridTemplateColumns = `${HABIT_COLUMN_WIDTH}px repeat(${dateKeys.length}, ${DAY_COLUMN_WIDTH}px)`;

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
            const isAltWeek = Math.floor(index / 7) % 2 === 1;

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
                  backgroundColor: isAltWeek
                    ? "rgba(143, 46, 255, 0.08)"
                    : "rgba(38, 37, 30, 0.03)",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {dayjs(dateKey).format("ddd")}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontSize: "1rem", color: "secondary.main" }}
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
                const checked = isHabitCompletedOnDate(
                  completions,
                  habit.id,
                  dateKey,
                );
                const isAltWeek = Math.floor(index / 7) % 2 === 1;

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
                        : isAltWeek
                          ? "rgba(143, 46, 255, 0.06)"
                          : "rgba(38, 37, 30, 0.02)",
                      color: habit.color ?? "secondary.main",
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
                          : isAltWeek
                            ? "rgba(143, 46, 255, 0.1)"
                            : "rgba(38, 37, 30, 0.05)",
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
