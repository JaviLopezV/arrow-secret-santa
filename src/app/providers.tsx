"use client";

import { MyUiProvider } from "@jlopvil/mui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyUiProvider
      defaultMode="light"
      themeOptions={{
        colorScheme: "light",
        brand: { primary: { main: "#253e39" }, secondary: { main: "#ad442e" } },
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
              body: { backgroundColor: "#f8f5ee", color: "#243d38" },
              "*:focus-visible": {
                outline: "3px solid #ad442e",
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
              root: { borderRadius: 12, backgroundColor: "#fffefa" },
            },
          },
          MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
        },
      }}
    >
      {children}
    </MyUiProvider>
  );
}
