import {
  Alert,
  Box,
  Button,
  Stack,
  Surface,
  TextField,
  Typography,
} from "@jlopvil/mui-kit";
import { Divider } from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LockOutlined from "@mui/icons-material/LockOutlined";
import type { Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";
import { Participants } from "./Participants";
import { Exclusions } from "./Exclusions";

export function Setup({
  controller: c,
  m,
}: {
  controller: GameController;
  m: Messages;
}) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <Surface
      padding="spacious"
      sx={{
        bgcolor: "#fffefa",
        boxShadow: "0 18px 60px #253e3909",
        borderColor: "#e1e3d8",
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "secondary.main",
              fontWeight: 800,
              letterSpacing: ".12em",
              fontSize: 10,
            }}
          >
            {m.form.eyebrow}
          </Typography>
          <Typography component="h2" variant="h2" sx={{ fontSize: 27, mt: 1 }}>
            {m.form.title}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#657369", mt: 1 }}>
            {m.form.description}
          </Typography>
        </Box>
        <Box
          component="fieldset"
          disabled={c.sending || !!c.game.delivery}
          sx={{
            border: 0,
            p: 0,
            m: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Stack spacing={2}>
            <TextField
              label={m.form.event}
              placeholder={m.form.eventPlaceholder}
              value={c.game.title}
              onChange={(e) => c.update({ title: e.target.value })}
              slotProps={{ htmlInput: { maxLength: 80 } }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1.2fr" },
                gap: 2,
              }}
            >
              <TextField
                label={m.form.budget}
                placeholder="25"
                value={c.game.budget}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { inputMode: "decimal", maxLength: 7 },
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  if (/^(|\d{1,4}(\.\d{0,2})?)$/.test(value))
                    c.update({ budget: value });
                }}
                onBlur={() => {
                  if (c.game.budget.endsWith("."))
                    c.update({ budget: c.game.budget.slice(0, -1) });
                }}
              />
              <TextField
                type="date"
                label={m.form.date}
                value={c.game.date}
                onChange={(e) => {
                  if (
                    /^(|\d{4}-\d{2}-\d{2})$/.test(e.target.value) &&
                    (!e.target.value || e.target.value >= today)
                  )
                    c.update({ date: e.target.value });
                }}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { min: today, max: "9999-12-31" },
                }}
              />
            </Box>
          </Stack>
          <Divider />
          <Participants controller={c} m={m} />
          <Exclusions controller={c} m={m} />
        </Box>
        {c.error && <Alert severity="error">{m.form[c.error]}</Alert>}
        <Stack spacing={1}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowForwardRounded />}
            disabled={!c.ready || c.sending || c.game.participants.length < 3}
            onClick={c.start}
            sx={{ minHeight: 56 }}
          >
            {c.sending
              ? m.form.sending
              : c.game.delivery
                ? m.form.retry
                : m.form.draw}
          </Button>
          {c.game.participants.length < 3 && (
            <Typography
              sx={{ textAlign: "center", fontSize: 12, color: "#657369" }}
            >
              {m.form.minimum}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <LockOutlined sx={{ fontSize: 16, color: "#657369" }} />
          <Typography sx={{ fontSize: 11, lineHeight: 1.6, color: "#657369" }}>
            {m.form.privacy}
          </Typography>
        </Stack>
      </Stack>
    </Surface>
  );
}
