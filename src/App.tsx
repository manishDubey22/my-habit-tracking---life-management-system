import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes } from "./app/routes";
import { appTheme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
