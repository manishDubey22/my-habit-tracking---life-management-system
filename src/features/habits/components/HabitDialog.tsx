import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Habit, HabitCategory } from "../../../domain/models/habit";
import { habitCategories, habitColorOptions } from "../constants";

interface HabitDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    category: HabitCategory;
    monthlyGoal: number;
    color: string;
  }) => void;
  initialHabit?: Habit;
}

export function HabitDialog({
  open,
  onClose,
  onSubmit,
  initialHabit,
}: HabitDialogProps) {
  const [title, setTitle] = useState<string>(initialHabit?.title ?? "");
  const [category, setCategory] = useState<HabitCategory>(
    initialHabit?.category ?? "Personal",
  );
  const [monthlyGoal, setMonthlyGoal] = useState<number>(
    initialHabit?.monthlyGoal ?? 20,
  );
  const [color, setColor] = useState<string>(
    initialHabit?.color ?? habitColorOptions[0],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    onSubmit({
      title: normalizedTitle,
      category,
      monthlyGoal: Math.min(31, Math.max(1, monthlyGoal)),
      color,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h3">
            {initialHabit ? "Update Habit" : "Create New Habit"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              label="Habit Name"
              placeholder="e.g., Morning Exercise"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              autoFocus
            />

            <TextField
              select
              label="Category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as HabitCategory)
              }
              fullWidth
            >
              {habitCategories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Monthly Goal (days)"
              type="number"
              value={monthlyGoal}
              onChange={(event) => setMonthlyGoal(Number(event.target.value))}
              slotProps={{ htmlInput: { min: 1, max: 31 } }}
              fullWidth
            />

            <Stack spacing={1.25}>
              <Typography variant="body2" color="text.secondary">
                Color
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <ToggleButtonGroup
                  exclusive
                  value={color}
                  onChange={(_, value: string | null) => {
                    if (value) setColor(value);
                  }}
                  sx={{ flexWrap: "wrap", gap: 1, border: 0 }}
                >
                  {habitColorOptions.map((option) => (
                    <ToggleButton
                      key={option}
                      value={option}
                      sx={{
                        borderRadius: "999px !important",
                        border: "1px solid rgba(38, 37, 30, 0.18) !important",
                        width: 42,
                        height: 42,
                        p: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "999px",
                          display: "inline-block",
                          background: option,
                        }}
                      />
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {initialHabit ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
