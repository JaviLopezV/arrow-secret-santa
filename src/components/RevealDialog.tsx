import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@jlopvil/mui-kit";
import RedeemRounded from "@mui/icons-material/RedeemRounded";
import type { Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";

export function RevealDialog({
  personId,
  close,
  controller: c,
  m,
}: {
  personId: string;
  close: () => void;
  controller: GameController;
  m: Messages;
}) {
  const [revealed, setRevealed] = useState(false);
  const person = c.game.participants.find((p) => p.id === personId);
  const receiverId = c.game.assignments.find(
    (a) => a.giver === personId,
  )?.receiver;
  const receiver = c.game.participants.find((p) => p.id === receiverId);
  useEffect(() => {
    const hide = () => setRevealed(false);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    return () => {
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  function dismiss() {
    setRevealed(false);
    close();
  }
  return (
    <Dialog
      open={!!person}
      onClose={dismiss}
      maxWidth="xs"
      fullWidth
      aria-labelledby="reveal-title"
      aria-describedby="reveal-description"
    >
      <DialogTitle id="reveal-title">
        {m.results.dialogTitle.replace("{name}", person?.name ?? "")}
      </DialogTitle>
      <DialogContent>
        <Stack
          spacing={3}
          alignItems="center"
          sx={{ py: 2, textAlign: "center" }}
        >
          <Box
            sx={{
              p: 3,
              bgcolor: "#f9e2d5",
              borderRadius: 5,
              color: "secondary.main",
            }}
          >
            <RedeemRounded sx={{ fontSize: 54 }} />
          </Box>
          <Typography id="reveal-description">
            {revealed ? m.results.gives : m.results.dialogDescription}
          </Typography>
          {revealed && (
            <Box role="status">
              <Typography
                sx={{ fontSize: 34, fontWeight: 800, overflowWrap: "anywhere" }}
              >
                {receiver?.name}
              </Typography>
              <Typography sx={{ fontSize: 14, mt: 2 }}>
                {m.results.secret}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          flexDirection: "column",
          gap: 1,
          "& > :not(style) ~ :not(style)": { ml: 0 },
        }}
      >
        {revealed ? (
          <Button fullWidth variant="contained" onClick={dismiss}>
            {m.results.hide}
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setRevealed(true);
                c.markOpened(personId);
              }}
            >
              {m.results.reveal}
            </Button>
            <Button fullWidth onClick={dismiss}>
              {m.results.cancel}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
