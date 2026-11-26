import { describe, expect, it } from 'vitest';
import { awardMove, createFootballState, finishGame, type FootballRules, type FootballState } from '../src/games/football/logic';
import { canUndo, commit, createHistory, undo } from '../src/core/game-session/history';

const rules: FootballRules = { fieldsPerSide: 2, goalsToWin: 2, stepsPerAward: 1 };

describe('football logic', () => {
  it('moves the ball towards the opponent goal', () => {
    let s = createFootballState();
    s = awardMove(rules, s, 0);
    expect(s.ball).toBe(1);
    s = awardMove(rules, s, 1);
    s = awardMove(rules, s, 1);
    expect(s.ball).toBe(-1);
    expect(s.score).toEqual([0, 0]);
  });

  it('scores when the ball passes the last field and restarts at kick-off', () => {
    let s = createFootballState();
    s = awardMove(rules, s, 0);
    s = awardMove(rules, s, 0);
    expect(s.goalEvent).toBeNull();
    s = awardMove(rules, s, 0);
    expect(s.score).toEqual([1, 0]);
    expect(s.ball).toBe(0);
    expect(s.goalEvent).toEqual({ team: 0, seq: 1 });
    expect(s.finished).toBe(false);
    s = awardMove(rules, s, 1);
    expect(s.goalEvent).toBeNull();
  });

  it('counts an overshooting multi-step move as one goal', () => {
    const s = awardMove({ ...rules, stepsPerAward: 2 }, { ...createFootballState(), ball: -2 }, 1);
    expect(s.score).toEqual([0, 1]);
    expect(s.ball).toBe(0);
  });

  it('ends the game at the goal target and ignores further moves', () => {
    let s: FootballState = { ...createFootballState(), score: [1, 0], ball: 2 };
    s = awardMove(rules, s, 0);
    expect(s.finished).toBe(true);
    expect(s.winner).toBe(0);
    expect(awardMove(rules, s, 1)).toBe(s);
  });

  it('never ends by itself in open-end mode', () => {
    let s = createFootballState();
    for (let i = 0; i < 30; i++) s = awardMove({ ...rules, goalsToWin: null }, s, 0);
    expect(s.score[0]).toBe(10);
    expect(s.finished).toBe(false);
  });

  it('finishes manually by score, including a draw', () => {
    expect(finishGame({ ...createFootballState(), score: [2, 2] }).winner).toBe('draw');
    expect(finishGame({ ...createFootballState(), score: [1, 3] }).winner).toBe(1);
  });

  it('undo restores score and ball position of the previous move', () => {
    let h = createHistory(createFootballState());
    expect(canUndo(h)).toBe(false);
    h = commit(h, awardMove(rules, h.present, 0));
    h = commit(h, awardMove(rules, h.present, 0));
    h = commit(h, awardMove(rules, h.present, 0)); // goal
    expect(h.present.score).toEqual([1, 0]);
    h = undo(h);
    expect(h.present.score).toEqual([0, 0]);
    expect(h.present.ball).toBe(2);
    h = undo(undo(undo(h)));
    expect(h.present).toEqual(createFootballState());
  });

  it('does not grow the history for no-op moves', () => {
    const finished = finishGame(createFootballState());
    const h = commit(createHistory(finished), awardMove(rules, finished, 0));
    expect(h.past).toHaveLength(0);
  });
});
