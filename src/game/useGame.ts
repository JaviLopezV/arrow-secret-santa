"use client";

import { useEffect, useRef, useState } from "react";
import { validEmail } from "./email";
import type { Locale } from "@/i18n/messages";
import { emptyGame, MAX_PARTICIPANTS, type Game } from "./types";
import { parseGame, storageKey } from "./storage";

type FormError =
  | "duplicate"
  | "invalidName"
  | "full"
  | "impossible"
  | "invalidEmail"
  | "duplicateEmail"
  | "sendError"
  | "unavailable"
  | "uncertain"
  | "expired"
  | "";

export function useGame(locale: Locale) {
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [game, setGame] = useState<Game>(emptyGame);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [error, setError] = useState<FormError>("");
  useEffect(() => {
    try {
      setGame(parseGame(sessionStorage.getItem(storageKey)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(game));
    } catch {
      setStorageError(true);
    }
  }, [game, ready]);

  function addPerson(name: string, email: string): boolean {
    const address = email.trim().toLowerCase();
    if (!validEmail(address)) {
      setError("invalidEmail");
      return false;
    }
    if (game.participants.some((p) => p.email === address)) {
      setError("duplicateEmail");
      return false;
    }
    const clean = name.trim().replace(/\s+/g, " ").normalize("NFC");
    if (!clean || clean.length > 40) {
      setError("invalidName");
      return false;
    }
    if (game.participants.length >= MAX_PARTICIPANTS) {
      setError("full");
      return false;
    }
    if (
      game.participants.some(
        (p) => p.name.toLocaleLowerCase() === clean.toLocaleLowerCase(),
      )
    ) {
      setError("duplicate");
      return false;
    }
    setGame((current) => ({
      ...current,
      participants: [
        ...current.participants,
        { id: crypto.randomUUID(), name: clean, email: address },
      ],
    }));
    setError("");
    return true;
  }
  function removePerson(id: string) {
    setGame((current) => ({
      ...current,
      participants: current.participants.filter((p) => p.id !== id),
      exclusions: current.exclusions.filter((pair) => !pair.includes(id)),
    }));
    setError("");
  }
  function exclude(a: string, b: string) {
    if (
      !a ||
      !b ||
      a === b ||
      game.exclusions.some((pair) => pair.includes(a) && pair.includes(b))
    )
      return;
    setGame((current) => ({
      ...current,
      exclusions: [...current.exclusions, [a, b]],
    }));
    setError("");
  }
  async function start() {
    if (busy.current) return;
    busy.current = true;
    setSending(true);
    setError("");
    const delivery = game.delivery ?? {
      id: crypto.randomUUID(),
      locale,
      status: "pending" as const,
    };
    const snapshot = { ...game, assignments: [], opened: [], delivery };
    // Save the retry key before any request can leave the browser.
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {
      setStorageError(true);
      setError("sendError");
      busy.current = false;
      setSending(false);
      return;
    }
    setGame(snapshot);
    try {
      const response = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: snapshot,
          locale: delivery.locale,
          id: delivery.id,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          ["impossible", "unavailable", "expired", "uncertain"].includes(result.error)
            ? result.error
            : "sendError",
        );
        if (result.error === "impossible" || result.error === "unavailable")
          setGame({ ...snapshot, delivery: undefined });
        return;
      }
      setGame({ ...snapshot, delivery: { ...delivery, status: "sent" } });
    } catch {
      setError("sendError");
    } finally {
      busy.current = false;
      setSending(false);
    }
  }
  function reset() {
    setGame({ ...emptyGame });
    setError("");
  }
  return {
    game,
    sending,
    ready,
    storageError,
    error,
    addPerson,
    removePerson,
    exclude,
    start,
    reset,
    update: (patch: Partial<Game>) =>
      setGame((current) => ({ ...current, ...patch })),
    removeExclusion: (index: number) => {
      setGame((current) => ({
        ...current,
        exclusions: current.exclusions.filter((_, i) => i !== index),
      }));
      setError("");
    },
    markOpened: (id: string) =>
      setGame((current) => ({
        ...current,
        opened: current.opened.includes(id)
          ? current.opened
          : [...current.opened, id],
      })),
  };
}
export type GameController = ReturnType<typeof useGame>;
