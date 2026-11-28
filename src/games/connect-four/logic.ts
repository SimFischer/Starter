/**
 * Vier gewinnt rules – pure functions, no UI.
 * board[col][row] with row 0 at the bottom; a cell holds the team index or null.
 * Who may drop a disc is decided by the teacher (correct answer); the logic
 * only validates the move, detects four in a row and a full board.
 */
export type Team = 0 | 1;
export type Cell = Team | null;
export type TurnMode = 'earn' | 'alternate';

export interface ConnectFourRules {
  cols: number;
  rows: number;
  /** earn: whoever answers correctly drops · alternate: teams take turns. */
  turnMode: TurnMode;
}

export interface ConnectFourState {
  board: readonly (readonly Cell[])[];
  /** Team whose turn it is (alternate mode). */
  turn: Team;
  finished: boolean;
  winner: Team | 'draw' | null;
  winLine: readonly (readonly [number, number])[] | null;
  lastDrop: { col: number; row: number; team: Team; seq: number } | null;
  moves: number;
}

export const WIN_LENGTH = 4;

export function createConnectFourState(rules: ConnectFourRules): ConnectFourState {
  return {
    board: Array.from({ length: rules.cols }, () => Array.from({ length: rules.rows }, () => null)),
    turn: 0,
    finished: false,
    winner: null,
    winLine: null,
    lastDrop: null,
    moves: 0,
  };
}

/** Lowest free row of a column, or -1 if the column is full. */
export function freeRow(state: ConnectFourState, col: number): number {
  const column = state.board[col];
  return column ? column.indexOf(null) : -1;
}

export function canDrop(state: ConnectFourState, col: number): boolean {
  return !state.finished && freeRow(state, col) >= 0;
}

const DIRECTIONS: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1],
];

/** All cells of the longest line (≥ 4) through (col,row) for `team`, or null. */
export function findWinLine(board: ConnectFourState['board'], col: number, row: number, team: Team): [number, number][] | null {
  const at = (c: number, r: number) => board[c]?.[r];
  for (const [dc, dr] of DIRECTIONS) {
    const line: [number, number][] = [[col, row]];
    for (const sign of [1, -1]) {
      let c = col + dc * sign;
      let r = row + dr * sign;
      while (at(c, r) === team) {
        line.push([c, r]);
        c += dc * sign;
        r += dr * sign;
      }
    }
    if (line.length >= WIN_LENGTH) return line.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  return null;
}

export function dropDisc(rules: ConnectFourRules, state: ConnectFourState, col: number, team: Team): ConnectFourState {
  if (!canDrop(state, col)) return state;
  const row = freeRow(state, col);
  const board = state.board.map((column, c) => (c === col ? column.map((cell, r) => (r === row ? team : cell)) : column));
  const winLine = findWinLine(board, col, row, team);
  const full = board.every((column) => column.every((cell) => cell !== null));
  const moves = state.moves + 1;
  const other: Team = team === 0 ? 1 : 0;
  return {
    board,
    turn: rules.turnMode === 'alternate' ? other : state.turn,
    finished: winLine !== null || full,
    winner: winLine ? team : full ? 'draw' : null,
    winLine,
    lastDrop: { col, row, team, seq: moves },
    moves,
  };
}

/** Alternate mode: no correct answer – the other team gets the next question. */
export function passTurn(state: ConnectFourState): ConnectFourState {
  if (state.finished) return state;
  return { ...state, turn: state.turn === 0 ? 1 : 0, lastDrop: null };
}

/** Manual end by the teacher: without four in a row it counts as a draw. */
export function finishConnectFour(state: ConnectFourState): ConnectFourState {
  return state.finished ? state : { ...state, finished: true, winner: 'draw', lastDrop: null };
}
