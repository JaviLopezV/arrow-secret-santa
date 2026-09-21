import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Surface,
  Typography,
} from "@jlopvil/mui-kit";
import { Chip, LinearProgress } from "@mui/material";
import RedeemRounded from "@mui/icons-material/RedeemRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import type { Locale, Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";
import { RevealDialog } from "./RevealDialog";

export function Results({
  controller: c,
  m,
  locale,
}: {
  controller: GameController;
  m: Messages;
  locale: Locale;
}) {
  const [personId, setPersonId] = useState("");
  const [confirm, setConfirm] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const progress = `${c.game.opened.length} / ${c.game.participants.length} ${m.results.progress}`;
  return (
    <Surface padding="spacious" sx={{ bgcolor: "#fffefa" }}>
      <Stack spacing={3}>
        <Box>
          <Chip
            icon={<CheckCircleOutlineRounded />}
            label={m.results.ready}
            color="success"
            variant="outlined"
            size="small"
          />
          <Typography
            ref={heading}
            tabIndex={-1}
            component="h2"
            variant="h2"
            sx={{ fontSize: 30, mt: 2 }}
          >
            {m.results.title}
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: 14, color: "#657369" }}>
            {m.results.description}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: "#f1f2e9", p: 2, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 750, overflowWrap: "anywhere" }}>
            {c.game.title || m.results.defaultEvent}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 0.5, flexWrap: "wrap" }}>
            {c.game.budget && (
              <Typography variant="body2">
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "EUR",
                }).format(Number(c.game.budget))}
              </Typography>
            )}
            {c.game.date && (
              <Typography variant="body2">
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "long",
                  timeZone: "UTC",
                }).format(new Date(`${c.game.date}T12:00:00Z`))}
              </Typography>
            )}
          </Stack>
        </Box>
        <Box>
          <Typography variant="caption" id="progress-label">
            {progress}
          </Typography>
          <LinearProgress
            aria-labelledby="progress-label"
            variant="determinate"
            value={(c.game.opened.length / c.game.participants.length) * 100}
            sx={{ mt: 1, height: 6, borderRadius: 3 }}
          />
        </Box>
        <Stack spacing={1}>
          {c.game.participants.map((p) => {
            const opened = c.game.opened.includes(p.id);
            return (
              <Button
                key={p.id}
                variant="outlined"
                onClick={() => setPersonId(p.id)}
                aria-label={`${p.name}: ${opened ? m.results.again : m.results.choose}`}
                startIcon={
                  opened ? <CheckCircleOutlineRounded /> : <RedeemRounded />
                }
                sx={{
                  justifyContent: "flex-start",
                  px: 2,
                  py: 1.5,
                  borderColor: "#d9ded2",
                  textAlign: "left",
                }}
              >
                <Box sx={{ flex: 1, overflowWrap: "anywhere" }}>{p.name}</Box>
                <Typography component="span" sx={{ fontSize: 11, ml: 1 }}>
                  {opened ? m.results.seen : m.results.pending}
                </Typography>
              </Button>
            );
          })}
        </Stack>
        <Alert severity="info">{m.results.notice}</Alert>
        <Button onClick={() => setConfirm(true)}>{m.results.restart}</Button>
      </Stack>
      <RevealDialog
        key={`${personId}-${locale}`}
        personId={personId}
        close={() => setPersonId("")}
        controller={c}
        m={m}
      />
      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
      >
        <DialogTitle id="reset-title">{m.results.confirmTitle}</DialogTitle>
        <DialogContent>
          <Typography id="reset-description">
            {m.results.confirmText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>{m.results.keep}</Button>
          <Button tone="danger" onClick={c.reset}>
            {m.results.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Surface>
  );
}
