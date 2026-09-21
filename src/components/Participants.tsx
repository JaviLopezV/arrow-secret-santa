import { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@jlopvil/mui-kit";
import { Avatar } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import PeopleOutlineRounded from "@mui/icons-material/PeopleOutlineRounded";
import type { Messages } from "@/i18n/messages";
import type { GameController } from "@/game/useGame";

export function Participants({
  controller: c,
  m,
}: {
  controller: GameController;
  m: Messages;
}) {
  const [name, setName] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const fieldError = c.error && c.error !== "impossible" ? m.form[c.error] : "";
  function add() {
    if (c.addPerson(name)) setName("");
    input.current?.focus();
  }
  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography component="h3" sx={{ fontWeight: 750 }}>
          {m.form.people}
        </Typography>
        <Typography
          role="status"
          sx={{
            fontSize: 12,
            bgcolor: "#f0f2ec",
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
          }}
        >
          {c.game.participants.length} / 30 {m.form.count}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          inputRef={input}
          label={m.form.name}
          placeholder={m.form.namePlaceholder}
          value={name}
          error={!!fieldError}
          helperText={fieldError || undefined}
          slotProps={{ htmlInput: { maxLength: 40 } }}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button
          onClick={add}
          variant="outlined"
          aria-label={m.form.add}
          sx={{ minWidth: 56, height: 56 }}
        >
          <AddRounded />
        </Button>
      </Stack>
      {c.game.participants.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 2.5,
            px: 3,
            border: "1px dashed #d7dace",
            borderRadius: 3,
            bgcolor: "#fafbf7",
          }}
        >
          <PeopleOutlineRounded sx={{ color: "#758371", mb: 0.5 }} />
          <Typography sx={{ fontSize: 13, color: "#657369" }}>
            {m.form.empty}
          </Typography>
        </Box>
      ) : (
        <Box
          component="ul"
          sx={{
            m: 0,
            p: 0,
            display: "grid",
            gap: 0.75,
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {c.game.participants.map((person, index) => (
            <Stack
              component="li"
              key={person.id}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ bgcolor: "#f7f7f2", borderRadius: 2, pl: 1.5, pr: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 12,
                  bgcolor: index % 2 ? "#e5eadf" : "#f5e0d6",
                  color: "primary.main",
                }}
              >
                {person.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <Typography
                sx={{ flex: 1, fontSize: 14, overflowWrap: "anywhere" }}
              >
                {person.name}
              </Typography>
              <IconButton
                aria-label={`${m.form.remove} ${person.name}`}
                onClick={() => {
                  c.removePerson(person.id);
                  input.current?.focus();
                }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Box>
      )}
      <Typography variant="caption" sx={{ color: "#657369" }}>
        {m.form.limit}
      </Typography>
    </Stack>
  );
}
