import { alpha, createTheme } from "@mui/material/styles";

const palette = {
  cream: "#f2f1ed",
  surface: "#ebeae5",
  surfaceStrong: "#e6e5e0",
  ink: "#26251e",
  muted: "rgba(38, 37, 30, 0.6)",
  border: "rgba(38, 37, 30, 0.1)",
  borderStrong: "rgba(38, 37, 30, 0.2)",
  violet: "#8f2eff",
  violetStrong: "#6f1df4",
  orange: "#f54e00",
  success: "#1f8a65",
  rose: "#cf2d56",
  sky: "#9fbbe0",
  sage: "#9fc9a2",
  peach: "#dfa88f",
} as const;

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.ink,
    },
    secondary: {
      main: palette.violet,
    },
    success: {
      main: palette.success,
    },
    warning: {
      main: palette.orange,
    },
    error: {
      main: palette.rose,
    },
    background: {
      default: palette.cream,
      paper: "#ffffff",
    },
    text: {
      primary: palette.ink,
      secondary: palette.muted,
    },
    divider: palette.border,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      '"Aptos", "Segoe UI", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
      lineHeight: 1.08,
      letterSpacing: "-0.06em",
      fontWeight: 700,
    },
    h2: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      lineHeight: 1.12,
      letterSpacing: "-0.04em",
      fontWeight: 700,
    },
    h3: {
      fontSize: "clamp(1.5rem, 2vw, 2rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.03em",
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.6rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "-0.01em",
    },
    body1: {
      lineHeight: 1.65,
    },
    body2: {
      lineHeight: 1.55,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          backgroundImage: "none",
          border: `1px solid ${palette.border}`,
          boxShadow:
            "rgba(0,0,0,0.05) 0px 18px 48px, rgba(0,0,0,0.03) 0px 8px 18px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 44,
        },
        contained: {
          background: `linear-gradient(135deg, ${palette.violet} 0%, ${palette.violetStrong} 100%)`,
          color: "#fff",
          "&:hover": {
            background: `linear-gradient(135deg, ${palette.violetStrong} 0%, ${palette.violet} 100%)`,
          },
        },
        outlined: {
          borderColor: palette.borderStrong,
          backgroundColor: alpha("#ffffff", 0.72),
          "&:hover": {
            borderColor: palette.ink,
            backgroundColor: alpha(palette.surfaceStrong, 0.5),
          },
        },
        text: {
          "&:hover": {
            backgroundColor: alpha(palette.surfaceStrong, 0.5),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: palette.surface,
          color: palette.ink,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          border: `1px solid ${palette.border}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha("#ffffff", 0.65),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.borderStrong,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.ink,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.violet,
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export const appPalette = palette;
