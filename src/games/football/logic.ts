/**
 * Tafelfußball game rules – pure functions, no UI.
 * Team 0 plays left → right, team 1 right → left. Position 0 is the kick-off
 * spot; ±(fieldsPerSide + 1) is inside a goal.
 */
export type Side = 0 | 1;

export interface FootballRules {
  /** Field positions between kick-off spot and each goal (2–5). */
  fieldsPerSide: number;
  /** Goals needed to win; null = open end. */
  goalsToWin: number | null;
  /** Fields the ball moves per correct answer (1–2). */
  stepsPerAward: number;
}

export interface FootballState {
  ball: number;
  score: readonly [number, number];
  /** Set only on the move that scored; seq counts all goals so far. */
  goalEvent: { team: Side; seq: number } | null;
  finished: boolean;
  winner: Side | 'draw' | null;
  /** Total number of goals (stable id for goal events). */
  goals: number;
}

export function createFootballState(): FootballState {
  return { ball: 0, score: [0, 0], goalEvent: null, finished: false, winner: null, goals: 0 };
}

export function awardMove(rules: FootballRules, state: FootballState, team: Side, steps = rules.stepsPerAward): FootballState {
  if (state.finished || steps <= 0) return state;
  const ball = state.ball + (team === 0 ? steps : -steps);

  if (Math.abs(ball) <= rules.fieldsPerSide) {
    return { ...state, ball, goalEvent: null };
  }

  const score: [number, number] = [state.score[0], state.score[1]];
  score[team] += 1;
  const goals = state.goals + 1;
  const won = rules.goalsToWin !== null && score[team] >= rules.goalsToWin;
  return {
    ball: 0,
    score,
    goals,
    goalEvent: { team, seq: goals },
    finished: won,
    winner: won ? team : null,
  };
}

/** Ends the game (time limit or teacher decision); the score decides. */
export function finishGame(state: FootballState): FootballState {
  if (state.finished) return state;
  const [a, b] = state.score;
  return { ...state, finished: true, goalEvent: null, winner: a === b ? 'draw' : a > b ? 0 : 1 };
}
