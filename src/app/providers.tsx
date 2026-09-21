"use client";

import { MyUiProvider } from "@jlopvil/mui-kit";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MyUiProvider
      defaultMode="light"
      themeOptions={{
        colorScheme: "light",
        brand: { primary: { main: "#1f5a43" }, secondary: { main: "#b4232f" } },
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
                background:
                  "radial-gradient(circle at 8% 0%, #fff8e8 0%, #f7efdf 42%, #e7f0e8 100%)",
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
              root: { borderRadius: 12, backgroundColor: "#fffdf7" },
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
