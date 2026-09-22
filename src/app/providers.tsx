"use client";

import { MyUiProvider } from "@jlopvil/mui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyUiProvider
      defaultMode="light"
      themeOptions={{
        colorScheme: "light",
        brand: { primary: { main: "#1f5a43" }, secondary: { main: "#a3432c" } },
        typography: {
          fontFamily: '"Avenir Next", Avenir, "Segoe UI", sans-serif',
          h1: { fontWeight: 800, letterSpacing: "-0.065em", lineHeight: 1.06 },
          h2: { fontWeight: 750, letterSpacing: "-0.04em" },
          h3: { fontWeight: 750, letterSpacing: "-0.025em" },
          button: { fontWeight: 700, textTransform: "none" },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: "#f3f5f2",
                color: "#173c2d",
              },
              "*:focus-visible": {
                outline: "3px solid #d9a441",
                outlineOffset: 4,
              },
            },
          },
          MuiButton: {
            defaultProps: { variant: "text" },
            styleOverrides: { root: { borderRadius: 12, minHeight: 46 } },
          },
          MuiTextField: {
            defaultProps: { variant: "outlined", fullWidth: true },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: { borderRadius: 12, backgroundColor: "#fff", fontSize: 16 },
            },
          },
          MuiIconButton: {
            styleOverrides: { root: { minWidth: 44, minHeight: 44 } },
          },
          MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        },
      }}
    >
      {children}
    </MyUiProvider>
  );
}
