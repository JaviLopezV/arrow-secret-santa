"use client";

import { useEffect, useState } from "react";
import CasinoOutlined from "@mui/icons-material/CasinoOutlined";
import CardGiftcardRounded from "@mui/icons-material/CardGiftcardRounded";
import { ElfWorkshop } from "./ElfWorkshop";
import { GiftIdeas } from "./GiftIdeas";
import { Alert, Box, Container, Typography } from "@jlopvil/mui-kit";
import LockOutlined from "@mui/icons-material/LockOutlined";
import type { Locale, Messages } from "@/i18n/messages";
import { useGame } from "@/game/useGame";
import { Header } from "./Header";
import { LegalLinks } from "./LegalLinks";
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
  const [page, setPage] = useState("draw");
  useEffect(() => {
    const syncPage = () =>
      setPage(window.location.hash === "#gifts" ? "gifts" : "draw");
    syncPage();
    window.addEventListener("hashchange", syncPage);
    return () => window.removeEventListener("hashchange", syncPage);
  }, []);
  function navigate(next: string) {
    window.location.hash = next;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
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
        <nav className="app-navigation" aria-label={m.festive.navigation}>
          <button
            type="button"
            aria-current={page === "draw" ? "page" : undefined}
            onClick={() => navigate("draw")}
          >
            <CasinoOutlined />
            <span>{m.festive.draw}</span>
          </button>
          <button
            type="button"
            aria-current={page === "gifts" ? "page" : undefined}
            onClick={() => navigate("gifts")}
          >
            <CardGiftcardRounded />
            <span>{m.festive.gifts}</span>
          </button>
        </nav>
        <div hidden={page !== "draw"}>
          <div className="workspace">
            <aside className="intro">
              <span className="eyebrow">{m.festive.eyebrow}</span>
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
              <div className="workshop-decoration">
                <ElfWorkshop />
                <span>{m.festive.elfNote}</span>
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
                <Setup controller={controller} m={m} locale={locale} />
              )}
            </Box>
          </div>
        </div>
        <div hidden={page !== "gifts"}>
          <GiftIdeas m={m} />
        </div>
        <details className="help-panel" id="how">
          <summary>{m.ui.help}</summary>
          <HowItWorks m={m} />
          {children}
        </details>
      </Container>
      <footer className="app-footer">
        <LegalLinks locale={locale} />
        <Typography variant="caption">
          Arrow Secret Santa · {m.footer.text}
        </Typography>
      </footer>
    </>
  );
}
