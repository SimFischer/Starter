import { describe, expect, it } from 'vitest';
import {
  canDrop,
  createConnectFourState,
  dropDisc,
  finishConnectFour,
  passTurn,
  type ConnectFourRules,
  type ConnectFourState,
  type Team,
} from '../src/games/connect-four/logic';

const earn: ConnectFourRules = { cols: 7, rows: 6, turnMode: 'earn' };
const alternate: ConnectFourRules = { ...earn, turnMode: 'alternate' };

function play(rules: ConnectFourRules, moves: [number, Team][], start = createConnectFourState(rules)): ConnectFourState {
  return moves.reduce((s, [col, team]) => dropDisc(rules, s, col, team), start);
}

describe('connect four logic', () => {
  it('stacks discs from the bottom', () => {
    const s = play(earn, [[3, 0], [3, 1]]);
    expect(s.board[3]!.slice(0, 3)).toEqual([0, 1, null]);
    expect(s.lastDrop).toEqual({ col: 3, row: 1, team: 1, seq: 2 });
  });

  it('rejects full columns and invalid columns', () => {
    const s = play({ ...earn, rows: 2 }, [[0, 0], [0, 1]]);
    expect(canDrop(s, 0)).toBe(false);
    expect(dropDisc(earn, s, 0, 0)).toBe(s);
    expect(dropDisc(earn, s, 99, 0)).toBe(s);
  });

  it('detects horizontal, vertical and both diagonal wins', () => {
    expect(play(earn, [[0, 0], [1, 0], [2, 0], [3, 0]]).winner).toBe(0);
    expect(play(earn, [[5, 1], [5, 1], [5, 1], [5, 1]]).winner).toBe(1);
    // ascending diagonal for team 0
    const up = play(earn, [[0, 0], [1, 1], [1, 0], [2, 1], [2, 1], [2, 0], [3, 1], [3, 1], [3, 1], [3, 0]]);
    expect(up.winner).toBe(0);
    expect(up.winLine).toEqual([[0, 0], [1, 1], [2, 2], [3, 3]]);
    // descending diagonal for team 1
    const down = play(earn, [[3, 1], [2, 0], [2, 1], [1, 0], [1, 0], [1, 1], [0, 0], [0, 0], [0, 0], [0, 1]]);
    expect(down.winner).toBe(1);
    expect(down.winLine).toHaveLength(4);
  });

  it('does not count three in a row or separated discs', () => {
    const s = play(earn, [[0, 0], [1, 0], [2, 0], [4, 0]]);
    expect(s.winner).toBeNull();
    expect(s.finished).toBe(false);
  });

  it('reports a draw on a full board without winner', () => {
    const rules = { ...earn, cols: 2, rows: 2 };
    const s = play(rules, [[0, 0], [0, 1], [1, 1], [1, 0]]);
    expect(s.finished).toBe(true);
    expect(s.winner).toBe('draw');
  });

  it('alternates turns only in alternate mode', () => {
    expect(play(alternate, [[0, 0]]).turn).toBe(1);
    expect(play(earn, [[0, 0]]).turn).toBe(0);
    expect(passTurn(createConnectFourState(alternate)).turn).toBe(1);
  });

  it('ignores moves after the end; manual end without a line is a draw', () => {
    const won = play(earn, [[0, 0], [1, 0], [2, 0], [3, 0]]);
    expect(dropDisc(earn, won, 5, 1)).toBe(won);
    expect(finishConnectFour(createConnectFourState(earn)).winner).toBe('draw');
    expect(finishConnectFour(won)).toBe(won);
  });
});
