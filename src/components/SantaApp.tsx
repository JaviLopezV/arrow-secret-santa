"use client";

import { Alert, Box, Container, Stack, Typography } from "@jlopvil/mui-kit";
import type { Locale, Messages } from "@/i18n/messages";
import { useGame } from "@/game/useGame";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Setup } from "./Setup";
import { Results } from "./Results";
import { HowItWorks } from "./HowItWorks";

export function SantaApp({ locale, m }: { locale: Locale; m: Messages }) {
  const controller = useGame(locale);
  return (
    <>
      <Header locale={locale} m={m} />
      <Container component="main" id="main" tabIndex={-1} maxWidth="lg">
        {controller.storageError && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            {m.form.storage}
          </Alert>
        )}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.05fr" },
            alignItems: "start",
            gap: { xs: 5, md: 7 },
            py: { xs: 5, md: 7 },
          }}
        >
          <Hero m={m} />
          <Box
            id="draw"
            sx={{ scrollMarginTop: 24 }}
            aria-busy={!controller.ready}
          >
            {controller.game.delivery?.status === "sent" ? (
              <Results controller={controller} m={m} locale={locale} />
            ) : (
              <Setup controller={controller} m={m} />
            )}
          </Box>
        </Box>
        <HowItWorks m={m} />
      </Container>
      <Box component="footer" sx={{ borderTop: "1px solid #e4d7c9", py: 3 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 650 }}>
              Arrow Secret Santa · {m.footer.text}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#65756a" }}>
              {m.footer.privacy}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
