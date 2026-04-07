import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AppShell } from "./app/layout/AppShell";

const theme = createTheme({
  palette: {
    primary: { main: "#7c3aed" },
    secondary: { main: "#ec4899" },
    info: { main: "#3b82f6" },
    background: { default: "#f8fafc" },
  },
  shape: { borderRadius: 10 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell />
    </ThemeProvider>
  );
}

export default App;
