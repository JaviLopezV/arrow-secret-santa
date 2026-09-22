"use client";

import { Alert, Box, Container, Typography } from "@jlopvil/mui-kit";
import LockOutlined from "@mui/icons-material/LockOutlined";
import type { Locale, Messages } from "@/i18n/messages";
import { useGame } from "@/game/useGame";
import { Header } from "./Header";
import { Setup } from "./Setup";
import { Results } from "./Results";
import { HowItWorks } from "./HowItWorks";

export function SantaApp({
  locale,
  m,
  children,
}: {
  locale: Locale;
  m: Messages;
  children?: React.ReactNode;
}) {
  const controller = useGame(locale);
  return (
    <>
      <Header locale={locale} m={m} />
      <Container
        component="main"
        id="main"
        tabIndex={-1}
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 } }}
      >
        <div className="workspace">
          <aside className="intro">
            <span className="eyebrow">SECRET SANTA, BY ARROW</span>
            <h1>
              {m.ui.title}
              <span className="title-dot">.</span>
            </h1>
            <p>{m.ui.subtitle}</p>
            <div className="privacy-card">
              <LockOutlined />
              <div>
                <strong>{m.ui.private}</strong>
                <p>{m.ui.privateText}</p>
              </div>
            </div>
            <div className="intro-decoration" aria-hidden="true">
              <span>✳</span>
              <span>↗</span>
              <span>✳</span>
            </div>
          </aside>
          <Box id="draw" aria-busy={!controller.ready} sx={{ minWidth: 0 }}>
            {controller.storageError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {m.form.storage}
              </Alert>
            )}
            {controller.game.delivery?.status === "sent" ? (
              <Results controller={controller} m={m} locale={locale} />
            ) : (
              <Setup controller={controller} m={m} />
            )}
          </Box>
        </div>
        <details className="help-panel" id="how">
          <summary>{m.ui.help}</summary>
          <HowItWorks m={m} />
          {children}
        </details>
      </Container>
      <footer className="app-footer">
        <Typography variant="caption">
          Arrow Secret Santa · {m.footer.text}
        </Typography>
      </footer>
    </>
  );
}
