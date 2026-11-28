import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CARD_POOL,
  answerCallout,
  createPoolState,
  drawCard,
  pickCard,
  poolValues,
  sanitizeCardPool,
  type CardPoolConfig,
} from '../src/core/answer-modes/cardPool';

const small: CardPoolConfig = { ...DEFAULT_CARD_POOL, classicRanks: ['7', '8', '9'] };

describe('card pool', () => {
  it('builds values for classic and numbered sets', () => {
    expect(poolValues(DEFAULT_CARD_POOL)).toHaveLength(13);
    expect(poolValues({ ...DEFAULT_CARD_POOL, system: 'numbers', numberMax: 4 })).toEqual(['1', '2', '3', '4']);
  });

  it('draws every value exactly once without replacement', () => {
    const config = { ...small, autoReset: false };
    let state = createPoolState(config);
    const drawn: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = drawCard(config, state)!;
      drawn.push(r.value);
      state = r.state;
    }
    expect(drawn.sort()).toEqual(['7', '8', '9']);
    expect(drawCard(config, state)).toBeNull();
  });

  it('reshuffles automatically when the pool is empty', () => {
    const r = drawCard(small, { remaining: [] }, [], () => 0)!;
    expect(r.reshuffled).toBe(true);
    expect(r.value).toBe('7');
    expect(r.state.remaining).toEqual(['8', '9']);
  });

  it('never repeats a value inside one round (exclude)', () => {
    const config = { ...small, withReplacement: true };
    for (let i = 0; i < 20; i++) {
      const r = drawCard(config, createPoolState(config), ['7', '8'], Math.random)!;
      expect(r.value).toBe('9');
    }
    expect(drawCard(config, createPoolState(config), ['7', '8', '9'])).toBeNull();
  });

  it('keeps the pool unchanged with replacement', () => {
    const config = { ...small, withReplacement: true };
    const state = createPoolState(config);
    expect(drawCard(config, state)!.state).toBe(state);
  });

  it('removes manually picked values', () => {
    expect(pickCard(small, createPoolState(small), '8').remaining).toEqual(['7', '9']);
  });

  it('creates readable callouts', () => {
    expect(answerCallout('classic', '7')).toBe('Die Siebenen antworten!');
    expect(answerCallout('classic', 'A')).toBe('Die Asse antworten!');
    expect(answerCallout('numbers', '12')).toBe('Die Nummer 12 antwortet!');
  });

  it('sanitizes stored configs', () => {
    expect(sanitizeCardPool(null)).toEqual({ ...DEFAULT_CARD_POOL, classicRanks: [...DEFAULT_CARD_POOL.classicRanks] });
    const s = sanitizeCardPool({ system: 'numbers', numberMax: 999, classicRanks: ['7'], withReplacement: 'yes' });
    expect(s.numberMax).toBe(40);
    expect(s.classicRanks).toHaveLength(13); // fewer than 2 ranks → default
    expect(s.withReplacement).toBe(false);
  });
});
