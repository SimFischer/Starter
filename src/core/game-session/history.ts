/**
 * Immutable undo history for game states. Every logical move (award, goal,
 * manual end) is committed; undo restores the previous complete state,
 * including score and progress.
 */
export interface History<T> {
  readonly past: readonly T[];
  readonly present: T;
}

export const HISTORY_LIMIT = 200;

export function createHistory<T>(initial: T): History<T> {
  return { past: [], present: initial };
}

export function commit<T>(history: History<T>, next: T): History<T> {
  if (Object.is(next, history.present)) return history;
  const past = [...history.past, history.present];
  return { past: past.length > HISTORY_LIMIT ? past.slice(-HISTORY_LIMIT) : past, present: next };
}

export function canUndo<T>(history: History<T>): boolean {
  return history.past.length > 0;
}

export function undo<T>(history: History<T>): History<T> {
  const previous = history.past.at(-1);
  if (previous === undefined) return history;
  return { past: history.past.slice(0, -1), present: previous };
}
