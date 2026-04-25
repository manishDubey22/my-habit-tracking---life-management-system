import { Box, Button, Paper, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionTo: string;
}

export function PageHeader({
  title,
  subtitle,
  actionLabel,
  actionTo,
}: PageHeaderProps) {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h2">{title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>

        <Button component={RouterLink} to={actionTo} variant="contained">
          {actionLabel}
        </Button>
      </Box>
    </Paper>
  );
}
