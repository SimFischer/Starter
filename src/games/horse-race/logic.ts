/**
 * Pferderennen rules – pure functions, no UI.
 * Every team has one horse; progress counts stages (0 … trackLength).
 * The race ends when the first horse reaches the finish line, by time limit
 * or by the teacher; placements follow the progress (equal progress = equal place).
 */
export interface HorseRaceRules {
  /** Number of stages from start to finish. */
  trackLength: number;
  /** Stages per correct answer (normal move). */
  stepsPerAward: number;
}

export interface HorseRaceState {
  progress: readonly number[];
  finished: boolean;
  /** Last moved team and how far – drives the gallop animation. */
  lastMove: { team: number; steps: number; seq: number } | null;
  moves: number;
}

export function createRaceState(teamCount: number): HorseRaceState {
  return { progress: Array.from({ length: teamCount }, () => 0), finished: false, lastMove: null, moves: 0 };
}

export function advanceHorse(rules: HorseRaceRules, state: HorseRaceState, team: number, steps = rules.stepsPerAward): HorseRaceState {
  if (state.finished || steps <= 0 || team < 0 || team >= state.progress.length) return state;
  const progress = state.progress.map((p, i) => (i === team ? Math.min(rules.trackLength, p + steps) : p));
  const moves = state.moves + 1;
  return {
    progress,
    finished: progress[team]! >= rules.trackLength,
    lastMove: { team, steps, seq: moves },
    moves,
  };
}

export function finishRace(state: HorseRaceState): HorseRaceState {
  return state.finished ? state : { ...state, finished: true, lastMove: null };
}

/** Standard competition ranking: [5, 7, 7, 2] → [3, 1, 1, 4]. */
export function placements(progress: readonly number[]): number[] {
  return progress.map((p) => 1 + progress.filter((q) => q > p).length);
}

/** Teams on first place (several on a tie). */
export function leaders(progress: readonly number[]): number[] {
  const best = Math.max(...progress);
  return progress.flatMap((p, i) => (p === best ? [i] : []));
}
