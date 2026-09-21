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
  const [email, setEmail] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const fieldError =
    [
      "invalidName",
      "duplicate",
      "invalidEmail",
      "duplicateEmail",
      "full",
    ].includes(c.error) && c.error
      ? m.form[c.error]
      : "";
  function add() {
    if (c.addPerson(name, email)) {
      setName("");
      setEmail("");
    }
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
            bgcolor: "#e8f1e9",
            px: 1.5,
            py: 0.5,
            borderRadius: 5,
          }}
        >
          {c.game.participants.length} / 30 {m.form.count}
        </Typography>
      </Stack>
      <Stack spacing={1} alignItems="stretch">
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
        <TextField
          label={m.form.email}
          type="email"
          value={email}
          autoComplete="email"
          slotProps={{ htmlInput: { maxLength: 254 } }}
          onChange={(e) => setEmail(e.target.value)}
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
          <AddRounded /> {m.form.add}
        </Button>
      </Stack>
      {c.game.participants.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 2.5,
            px: 3,
            border: "1px dashed #d9cdbd",
            borderRadius: 3,
            bgcolor: "#fffaf1",
          }}
        >
          <PeopleOutlineRounded sx={{ color: "#b4232f", mb: 0.5 }} />
          <Typography sx={{ fontSize: 13, color: "#65756a" }}>
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
              sx={{ bgcolor: "#fffaf1", borderRadius: 2, pl: 1.5, pr: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 12,
                  bgcolor: index % 2 ? "#e8f1e9" : "#fbe5df",
                  color: "primary.main",
                }}
              >
                {person.name.slice(0, 1).toUpperCase()}
              </Avatar>
              <Typography
                sx={{ flex: 1, fontSize: 14, overflowWrap: "anywhere" }}
              >
                {person.name}
                <Typography component="span" display="block" variant="caption">
                  {person.email}
                </Typography>
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
      <Typography variant="caption" sx={{ color: "#65756a" }}>
        {m.form.limit}
      </Typography>
    </Stack>
  );
}
