import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@jlopvil/mui-kit";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
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
  const [step, setStep] = useState(0);
  const active = c.game.delivery ? 2 : step;
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(active);
  useEffect(() => {
    if (previous.current !== active) {
      heading.current?.focus({ preventScroll: true });
      heading.current
        ?.closest(".draw-card")
        ?.scrollIntoView({ block: "start" });
      previous.current = active;
    }
  }, [active]);
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const titles = [m.ui.peopleTitle, m.ui.detailsTitle, m.ui.reviewTitle];
  const descriptions = [
    m.ui.peopleDescription,
    m.ui.detailsDescription,
    m.ui.reviewDescription,
  ];
  const locked = !c.ready || c.sending || !!c.game.delivery;

  return (
    <section className="draw-card">
      <nav
        className="step-nav"
        aria-label={`${m.ui.step} ${active + 1} ${m.ui.of} 3`}
      >
        {m.ui.steps.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-current={active === index ? "step" : undefined}
            disabled={locked || index > step}
            onClick={() => setStep(index)}
          >
            <span className="step-number">
              {index < active ? (
                <CheckRounded sx={{ fontSize: 17 }} />
              ) : (
                index + 1
              )}
            </span>
            {label}
          </button>
        ))}
      </nav>
      <div className="step-content">
        <div className="step-heading">
          <span className="eyebrow">
            {m.ui.step} {active + 1} {m.ui.of} 3
          </span>
          <h2 ref={heading} tabIndex={-1}>
            {titles[active]}
          </h2>
          <p>{descriptions[active]}</p>
        </div>
        <Box
          component="fieldset"
          disabled={locked}
          sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}
        >
          <div hidden={active !== 0}>
            <Participants controller={c} m={m} />
          </div>
          {active === 1 && (
            <Stack spacing={3}>
              <TextField
                label={m.form.event}
                placeholder={m.form.eventPlaceholder}
                value={c.game.title}
                onChange={(e) => c.update({ title: e.target.value })}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
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
              <Typography variant="caption" color="text.secondary">
                {m.ui.optional}
              </Typography>
              <Exclusions controller={c} m={m} />
            </Stack>
          )}
          {active === 2 && (
            <Stack spacing={3}>
              <div className="review-block">
                <div className="review-heading">
                  <strong>{c.game.title || m.results.defaultEvent}</strong>
                  <Button size="small" onClick={() => setStep(1)}>
                    {m.ui.edit}
                  </Button>
                </div>
                <dl className="review-details">
                  <div>
                    <dt>{m.email.budget}</dt>
                    <dd>
                      {c.game.budget ? `${c.game.budget} €` : m.ui.noDetails}
                    </dd>
                  </div>
                  <div>
                    <dt>{m.email.date}</dt>
                    <dd>
                      {c.game.date
                        ? c.game.date.split("-").reverse().join(" / ")
                        : m.ui.noDetails}
                    </dd>
                  </div>
                </dl>
                {c.game.exclusions.length > 0 && (
                  <div className="review-exclusions">
                    <strong>{m.form.exclusions}</strong>
                    {c.game.exclusions.map((pair) => (
                      <p key={pair.join()}>
                        {pair
                          .map(
                            (id) =>
                              c.game.participants.find((p) => p.id === id)
                                ?.name,
                          )
                          .join(" ↔ ")}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="review-heading">
                  <strong>
                    {c.game.participants.length} {m.form.count}
                  </strong>
                  <Button size="small" onClick={() => setStep(0)}>
                    {m.ui.edit}
                  </Button>
                </div>
                <ul className="review-people">
                  {c.game.participants.map((p) => (
                    <li key={p.id}>
                      <span className="person-initial">
                        {p.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <strong>{p.name}</strong>
                        <span>{p.email}</span>
                      </div>
                      <CheckRounded
                        sx={{
                          color: "primary.main",
                          fontSize: 18,
                          ml: "auto",
                          flexShrink: 0,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <Typography variant="body2" color="text.secondary">
                {m.ui.reviewNote}
              </Typography>
            </Stack>
          )}
        </Box>
        {c.error &&
          ![
            "invalidName",
            "duplicate",
            "invalidEmail",
            "duplicateEmail",
            "full",
          ].includes(c.error) && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {m.form[c.error]}
            </Alert>
          )}
      </div>
      <div className="step-actions">
        {active === 0 && c.game.participants.length < 3 && (
          <p className="minimum-note">{m.form.minimum}</p>
        )}
        <Stack direction="row" spacing={1}>
          {active > 0 && (
            <Button
              disabled={locked}
              aria-label={m.ui.back}
              onClick={() => setStep(active - 1)}
              sx={{ minWidth: 52 }}
            >
              <ArrowBackRounded />
            </Button>
          )}
          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRounded />}
            disabled={!c.ready || c.sending || c.game.participants.length < 3}
            onClick={() => (active < 2 ? setStep(active + 1) : c.start())}
            sx={{ minHeight: 54 }}
          >
            {active < 2
              ? m.ui.next
              : c.sending
                ? m.form.sending
                : c.game.delivery
                  ? m.form.retry
                  : m.form.draw}
          </Button>
        </Stack>
      </div>
      <div className="privacy-note">
        <LockOutlined sx={{ fontSize: 15, flexShrink: 0 }} />
        <span>{m.form.privacy}</span>
      </div>
    </section>
  );
}
