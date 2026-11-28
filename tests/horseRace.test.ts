import { describe, expect, it } from 'vitest';
import { advanceHorse, createRaceState, finishRace, leaders, placements, type HorseRaceRules } from '../src/games/horse-race/logic';
import { commit, createHistory, undo } from '../src/core/game-session/history';

const rules: HorseRaceRules = { trackLength: 4, stepsPerAward: 1 };

describe('horse race logic', () => {
  it('starts every horse at 0', () => {
    expect(createRaceState(3).progress).toEqual([0, 0, 0]);
  });

  it('advances only the awarded horse', () => {
    const s = advanceHorse(rules, createRaceState(3), 1);
    expect(s.progress).toEqual([0, 1, 0]);
    expect(s.lastMove).toEqual({ team: 1, steps: 1, seq: 1 });
  });

  it('supports stronger moves and caps at the finish line', () => {
    let s = advanceHorse(rules, createRaceState(2), 0, 3);
    expect(s.progress).toEqual([3, 0]);
    s = advanceHorse(rules, s, 0, 3);
    expect(s.progress).toEqual([4, 0]);
    expect(s.finished).toBe(true);
  });

  it('ignores moves after the finish and invalid teams', () => {
    const done = { ...createRaceState(2), progress: [4, 1], finished: true };
    expect(advanceHorse(rules, done, 1)).toBe(done);
    const s = createRaceState(2);
    expect(advanceHorse(rules, s, 5)).toBe(s);
    expect(advanceHorse(rules, s, 0, 0)).toBe(s);
  });

  it('ranks with shared places on ties', () => {
    expect(placements([5, 7, 7, 2])).toEqual([3, 1, 1, 4]);
    expect(leaders([5, 7, 7, 2])).toEqual([1, 2]);
    expect(leaders([0, 0])).toEqual([0, 1]);
  });

  it('can be finished manually and undone', () => {
    let h = createHistory(createRaceState(2));
    h = commit(h, advanceHorse(rules, h.present, 0));
    h = commit(h, finishRace(h.present));
    expect(h.present.finished).toBe(true);
    h = undo(h);
    expect(h.present.finished).toBe(false);
    expect(h.present.progress).toEqual([1, 0]);
  });
});
