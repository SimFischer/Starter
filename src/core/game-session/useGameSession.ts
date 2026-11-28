import { useCallback, useEffect, useRef, useState } from 'react';
import { useCountdown, type Countdown } from '../../hooks/useCountdown';
import { canUndo, commit, createHistory, undo, type History } from './history';

interface Options<S> {
  initial: () => S;
  isFinished: (state: S) => boolean;
  /** Ends the game by teacher decision or time limit. */
  finish: (state: S) => S;
  timeLimitMinutes: number | null;
  /** Additional reasons to freeze timers and inputs (e.g. a running celebration). */
  extraHalt?: boolean;
}

export interface GameSession<S> {
  state: S;
  history: History<S>;
  canUndo: boolean;
  /** Commits a new logical state (ignored when nothing changed). */
  apply(next: S): void;
  undo(): void;
  endGame(): void;
  paused: boolean;
  setPaused(paused: boolean | ((p: boolean) => boolean)): void;
  /** True while inputs are locked after a move (prevents double taps). */
  busy: boolean;
  lock(ms: number): void;
  /** Timers and awards are frozen (pause, finished, celebration). */
  halted: boolean;
  clock: Countdown;
}

/** Shared session state of every team game: history/undo, pause, input lock, game clock. */
export function useGameSession<S>({ initial, isFinished, finish, timeLimitMinutes, extraHalt = false }: Options<S>): GameSession<S> {
  const [history, setHistory] = useState<History<S>>(() => createHistory(initial()));
  const [paused, setPaused] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyTimer = useRef(0);
  const finishRef = useRef(finish);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

  const state = history.present;
  const finished = isFinished(state);
  const halted = paused || finished || extraHalt;

  const endGame = useCallback(() => setHistory((h) => commit(h, finishRef.current(h.present))), []);
  const clock = useCountdown(halted, endGame);
  const { start } = clock;

  useEffect(() => {
    if (timeLimitMinutes) start(timeLimitMinutes * 60_000);
  }, [timeLimitMinutes, start]);

  useEffect(() => () => window.clearTimeout(busyTimer.current), []);

  const lock = useCallback((ms: number) => {
    setBusy(true);
    window.clearTimeout(busyTimer.current);
    busyTimer.current = window.setTimeout(() => setBusy(false), ms);
  }, []);

  return {
    state,
    history,
    canUndo: canUndo(history),
    apply: (next) => setHistory((h) => commit(h, next)),
    undo: () => setHistory(undo),
    endGame,
    paused,
    setPaused,
    busy,
    lock,
    halted,
    clock,
  };
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
