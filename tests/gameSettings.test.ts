import { describe, expect, it } from 'vitest';
import { nextFreeTeam, sanitizeTeams, teamsClash, DEFAULT_TEAMS } from '../src/core/teams/teams';
import { sanitizeFootballSettings, DEFAULT_FOOTBALL_SETTINGS } from '../src/games/football/settings';
import { sanitizeRaceSettings } from '../src/games/horse-race/settings';
import { rulesOf, sanitizeC4Settings } from '../src/games/connect-four/settings';

describe('team sanitizing', () => {
  it('clamps the team count and keeps teams distinguishable', () => {
    expect(sanitizeTeams(undefined, 2, 4)).toHaveLength(2);
    expect(sanitizeTeams(new Array(9).fill({}), 2, 4)).toHaveLength(4);
    const teams = sanitizeTeams(
      [
        { name: 'A', color: 'red', symbol: 'heart' },
        { name: 'B', color: 'red', symbol: 'star' },
        { name: 'C', color: 'blue', symbol: 'heart' },
      ],
      2,
      4,
    );
    for (let i = 0; i < teams.length; i++) for (let j = i + 1; j < teams.length; j++) expect(teamsClash(teams[i]!, teams[j]!)).toBe(false);
  });

  it('trims names and falls back for empty ones', () => {
    const [a] = sanitizeTeams([{ name: '   Die   Füchse  ', color: 'red', symbol: 'heart' }, {}], 2, 2);
    expect(a!.name).toBe('Die Füchse');
    expect(sanitizeTeams([{ name: '   ' }], 1, 1)[0]!.name).toBe(DEFAULT_TEAMS[0]!.name);
  });

  it('suggests a free team for a new slot', () => {
    expect(teamsClash(nextFreeTeam(DEFAULT_TEAMS.slice(0, 3)), DEFAULT_TEAMS[0]!)).toBe(false);
  });
});

describe('game settings sanitizing', () => {
  it('keeps football settings stored by Phase 2 compatible', () => {
    const stored = JSON.parse(JSON.stringify(DEFAULT_FOOTBALL_SETTINGS));
    expect(sanitizeFootballSettings(stored)).toEqual(DEFAULT_FOOTBALL_SETTINGS);
    expect(sanitizeFootballSettings({ mode: 'class-coop', rules: { fieldsPerSide: 99 } }).mode).toBe('hidden-cards');
  });

  it('sanitizes horse race and connect four settings', () => {
    const race = sanitizeRaceSettings({ teams: [{}, {}, {}], rules: { trackLength: 3 }, thinkSeconds: 7 });
    expect(race.teams).toHaveLength(3);
    expect(race.rules.trackLength).toBe(10);
    expect(race.thinkSeconds).toBe(20);
    const c4 = sanitizeC4Settings({ board: '8x7', turnMode: 'alternate' });
    expect(rulesOf(c4)).toEqual({ cols: 8, rows: 7, turnMode: 'alternate' });
    expect(sanitizeC4Settings({ board: '99x99' }).board).toBe('7x6');
  });
});
