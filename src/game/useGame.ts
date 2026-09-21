"use client";

import { useEffect, useState } from "react";
import { draw } from "./draw";
import { emptyGame, MAX_PARTICIPANTS, type Game } from "./types";
import { parseGame, storageKey } from "./storage";

type FormError = "duplicate" | "invalidName" | "full" | "impossible" | "";

export function useGame() {
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

  function addPerson(name: string): boolean {
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
        { id: crypto.randomUUID(), name: clean },
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
  function start() {
    const assignments = draw(game.participants, game.exclusions);
    if (!assignments) {
      setError("impossible");
      return;
    }
    setGame((current) => ({ ...current, assignments, opened: [] }));
    setError("");
  }
  function reset() {
    setGame({ ...emptyGame });
    setError("");
  }
  return {
    game,
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
