import { describe, expect, it } from 'vitest';
import { gamePath, parseRoute } from '../src/app/router';
import { describeTeams, getGame, listGames } from '../src/core/games/registry';

describe('game registry', () => {
  const games = listGames();

  it('contains the seven planned games with unique ids', () => {
    expect(games.map((g) => g.id)).toEqual([
      'football',
      'horse-race',
      'connect-four',
      'boss-battle',
      'jeopardy',
      'memory',
      'treasure-hunt',
    ]);
    for (const g of games) expect(getGame(g.id)).toBe(g);
  });

  it('keeps every game usable spontaneously (free teacher control)', () => {
    for (const g of games) expect(g.answerModes).toContain('free-control');
  });

  it('matches play style, team setup and answer modes', () => {
    for (const g of games) {
      expect(new Set(g.answerModes).size).toBe(g.answerModes.length);
      if (g.playStyle === 'cooperative') {
        expect(g.teams).toBeNull();
        expect(g.answerModes).toContain('class-coop');
      } else {
        expect(g.teams).not.toBeNull();
        expect(g.teams!.min).toBeGreaterThanOrEqual(2);
        expect(g.teams!.max).toBeLessThanOrEqual(4);
        expect(g.teams!.min).toBeLessThanOrEqual(g.teams!.max);
      }
      if (g.playStyle === 'competitive') expect(g.answerModes).not.toContain('class-coop');
      if (g.playStyle === 'flexible') expect(g.answerModes).toContain('class-coop');
    }
  });

  it('marks games honestly: playable exactly when a screen is registered', () => {
    for (const g of games) expect(g.status === 'playable').toBe(typeof g.load === 'function');
    expect(getGame('football')!.status).toBe('playable');
  });

  it('describes team setups in German', () => {
    expect(describeTeams(getGame('football')!)).toBe('2 Mannschaften');
    expect(describeTeams(getGame('horse-race')!)).toBe('2–4 Mannschaften');
    expect(describeTeams(getGame('boss-battle')!)).toBe('Ganze Klasse');
  });
});

describe('parseRoute', () => {
  it('maps hashes to routes and falls back to home', () => {
    const name = (h: string) => parseRoute(h).name;
    expect(name('')).toBe('home');
    expect(name('#/')).toBe('home');
    expect(name('#/einstellungen')).toBe('settings');
    expect(name('#/Einstellungen/')).toBe('settings');
    expect(name('#/fragenbibliothek')).toBe('library');
    expect(name('#/ki-prompts')).toBe('prompts');
    expect(name('#/gibt-es-nicht')).toBe('home');
    expect(name('#main')).toBe('home');
    expect(name('#/spiel/')).toBe('home');
    expect(parseRoute(gamePath('football'))).toEqual({ name: 'game', gameId: 'football' });
  });
});
