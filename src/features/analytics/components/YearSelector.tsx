import { Box, Button, Paper, Typography } from "@mui/material";

interface YearSelectorProps {
  year: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function YearSelector({ year, onPrevious, onNext }: YearSelectorProps) {
  return (
    <Paper
      sx={{
        p: 1.25,
        borderRadius: 999,
        position: "sticky",
        top: 20,
        zIndex: 5,
        mb: 3,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(242, 241, 237, 0.88))",
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.25,
          flexWrap: "wrap",
        }}
      >
        <Button variant="outlined" onClick={onPrevious}>
          ← {year - 1}
        </Button>
        <Box
          sx={{
            minWidth: 132,
            px: 2.5,
            py: 1.25,
            borderRadius: 999,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(143, 46, 255, 0.14), rgba(192, 168, 221, 0.22))",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Selected Year
          </Typography>
          <Typography variant="h3" sx={{ fontSize: "1.55rem" }}>
            {year}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={onNext}>
          {year + 1} →
        </Button>
      </Box>
    </Paper>
  );
}
