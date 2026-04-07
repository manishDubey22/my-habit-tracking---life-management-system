import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import type { HabitCategory } from "../../../domain/models/habit";
import { useHabitStore } from "../../../store/habitStore";

const categories: HabitCategory[] = [
  "Health",
  "Mindset",
  "Productivity",
  "Learning",
  "Lifestyle",
  "Other",
];

export function HabitForm() {
  const addHabit = useHabitStore((s) => s.addHabit);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HabitCategory>("Health");
  const [monthlyGoal, setMonthlyGoal] = useState(20);
  const [color, setColor] = useState("#7c3aed");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit({ title, category, monthlyGoal, color });
    setTitle("");
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label="Habit title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as HabitCategory)}
          size="small"
          className="min-w-36"
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Monthly goal"
          type="number"
          slotProps={{ htmlInput: { min: 1, max: 31 } }}
          value={monthlyGoal}
          onChange={(e) => setMonthlyGoal(Number(e.target.value || 1))}
          size="small"
          className="w-32"
        />
        <TextField
          label="Color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          size="small"
          className="w-24"
        />
        <Button type="submit" variant="contained">
          Add Habit
        </Button>
      </Stack>
    </form>
  );
}
