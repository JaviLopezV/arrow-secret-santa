import { useEffect, useRef } from "react";
import { Alert, Button, Stack, Typography } from "@jlopvil/mui-kit";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import AddRounded from "@mui/icons-material/AddRounded";
import type { Locale, Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";

export function Results({
  controller: c,
  m,
  locale,
}: {
  controller: GameController;
  m: Messages;
  locale: Locale;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section className="draw-card result-card">
      <div className="success-icon">
        <MarkEmailReadOutlined sx={{ fontSize: 42 }} />
      </div>
      <span className="eyebrow">{m.results.ready}</span>
      <Typography
        ref={heading}
        tabIndex={-1}
        component="h2"
        sx={{
          fontSize: { xs: 29, sm: 36 },
          fontWeight: 750,
          letterSpacing: "-.04em",
          lineHeight: 1.15,
          mt: 2,
        }}
      >
        {m.results.title}
      </Typography>
      <Typography
        sx={{ color: "#627066", fontSize: 14, mt: 2, lineHeight: 1.7 }}
      >
        {m.results.description}
      </Typography>
      <div className="result-summary">
        <strong>{c.game.title || m.results.defaultEvent}</strong>
        <span>
          {c.game.participants.length} {m.form.count}
        </span>
        {c.game.budget && (
          <span>
            {c.game.budget} € · {m.email.budget}
          </span>
        )}
        {c.game.date && (
          <span>
            {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
              new Date(`${c.game.date}T12:00:00`),
            )}
          </span>
        )}
      </div>
      <Stack spacing={3}>
        <Alert severity="info" sx={{ textAlign: "left" }}>
          {m.results.notice}
        </Alert>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddRounded />}
          onClick={c.reset}
        >
          {m.results.restart}
        </Button>
      </Stack>
    </section>
  );
}
