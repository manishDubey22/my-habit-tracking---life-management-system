import { Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import type { Completion } from "../../../domain/models/completion";
import type { Habit } from "../../../domain/models/habit";
import { getWeekChunks, isHabitCompletedOnDate } from "../lib/habitInsights";

interface HabitMonthGridProps {
  habits: Habit[];
  completions: Completion[];
  dateKeys: string[];
  onToggle: (habitId: string, dateKey: string) => void;
}

export function HabitMonthGrid({
  habits,
  completions,
  dateKeys,
  onToggle,
}: HabitMonthGridProps) {
  const weekChunks = getWeekChunks(dateKeys);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {weekChunks.map((week) => (
        <Paper key={week[0]} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                minWidth: 860,
                display: "grid",
                gridTemplateColumns: "220px repeat(7, minmax(90px, 1fr))",
                gap: 0.75,
                alignItems: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontSize: "1.1rem", px: 1.5 }}>
                Habits
              </Typography>

              {week.map((dateKey) => (
                <Box
                  key={dateKey}
                  sx={{
                    py: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.25,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(dateKey).format("ddd")}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontSize: "1.15rem", color: "secondary.main" }}
                  >
                    {dayjs(dateKey).format("D")}
                  </Typography>
                </Box>
              ))}

              {habits.map((habit) => (
                <Box key={habit.id} sx={{ display: "contents" }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "999px",
                        backgroundColor: habit.color ?? "secondary.main",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1">{habit.title}</Typography>
                  </Box>

                  {week.map((dateKey) => {
                    const checked = isHabitCompletedOnDate(
                      completions,
                      habit.id,
                      dateKey,
                    );

                    return (
                      <Box
                        key={`${habit.id}-${dateKey}`}
                        component="button"
                        type="button"
                        onClick={() => onToggle(habit.id, dateKey)}
                        sx={{
                          height: 124,
                          borderRadius: 2.5,
                          border: "2px solid",
                          borderColor: checked
                            ? (habit.color ?? "secondary.main")
                            : "rgba(38, 37, 30, 0.08)",
                          backgroundColor: checked
                            ? `${habit.color ?? "#8f2eff"}18`
                            : "rgba(255,255,255,0.72)",
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
                          },
                        }}
                      >
                        {checked ? (
                          <Typography
                            sx={{ fontSize: "1.8rem", lineHeight: 1 }}
                          >
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
      ))}
    </Box>
  );
}
