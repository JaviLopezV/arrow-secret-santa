import { useEffect, useRef } from "react";
import { Alert, Button, Stack, Surface, Typography } from "@jlopvil/mui-kit";
import type { Locale, Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";

export function Results({
  controller: c,
  m,
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
    <Surface padding="spacious" sx={{ bgcolor: "#fffdf7" }}>
      <Stack spacing={3}>
        <Alert severity="success">{m.results.ready}</Alert>
        <Typography
          ref={heading}
          tabIndex={-1}
          component="h2"
          variant="h2"
          sx={{ fontSize: 30 }}
        >
          {m.results.title}
        </Typography>
        <Typography>{m.results.description}</Typography>
        <Typography sx={{ fontWeight: 750 }}>
          {c.game.title || m.results.defaultEvent}
        </Typography>
        <Typography>
          {c.game.participants.length} {m.form.count}
        </Typography>
        <Alert severity="info">{m.results.notice}</Alert>
        <Button onClick={c.reset}>{m.results.restart}</Button>
      </Stack>
    </Surface>
  );
}
