import { useState } from "react";
import {
  Button,
  IconButton,
  SelectField,
  Stack,
  Typography,
} from "@jlopvil/mui-kit";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import type { Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";

export function Exclusions({
  controller: c,
  m,
}: {
  controller: GameController;
  m: Messages;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const options = c.game.participants.map((p) => ({
    value: p.id,
    label: p.name,
  }));
  const validA = options.some((o) => o.value === a) ? a : "";
  const validB = options.some((o) => o.value === b && b !== validA) ? b : "";
  const duplicate = c.game.exclusions.some(
    (pair) => pair.includes(a) && pair.includes(b),
  );
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid #e2e4db",
        borderRadius: "12px !important",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        id="exclusions-header"
        aria-controls="exclusions-content"
      >
        <Typography sx={{ fontSize: 13, fontWeight: 650 }}>
          {m.form.exclusions} ({c.game.exclusions.length})
        </Typography>
      </AccordionSummary>
      <AccordionDetails id="exclusions-content">
        <Stack spacing={2}>
          <Typography variant="body2">{m.form.explanation}</Typography>
          <SelectField<string>
            label={m.form.first}
            value={validA}
            options={options}
            emptyOption="—"
            onChange={setA}
          />
          <SelectField<string>
            label={m.form.second}
            value={validB}
            options={options.filter((o) => o.value !== validA)}
            emptyOption="—"
            onChange={setB}
          />
          <Button
            variant="outlined"
            disabled={!validA || !validB || a === b || duplicate}
            onClick={() => {
              c.exclude(a, b);
              setA("");
              setB("");
            }}
          >
            {m.form.exclude}
          </Button>
          {c.game.exclusions.map(([first, second], index) => {
            const names = [first, second]
              .map((id) => c.game.participants.find((p) => p.id === id)?.name)
              .join(" ↔ ");
            return (
              <Stack
                key={`${first}-${second}`}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                  {names}
                </Typography>
                <IconButton
                  aria-label={`${m.form.removeExclusion}: ${names}`}
                  onClick={() => c.removeExclusion(index)}
                >
                  <CloseRounded fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
