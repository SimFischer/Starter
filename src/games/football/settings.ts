import { DEFAULT_CARD_POOL, sanitizeCardPool, type CardPoolConfig } from '../../core/answer-modes/cardPool';
import type { AnswerModeId } from '../../core/answer-modes/answerModes';
import { persistedSettings } from '../../core/settings/persistedSettings';
import { DEFAULT_TEAMS, sanitizeTeam, teamsClash, type TeamConfig } from '../../core/teams/teams';
import type { FootballRules } from './logic';

export const FOOTBALL_MODES = ['hidden-cards', 'team-consult', 'open-round', 'free-control'] as const satisfies readonly AnswerModeId[];
export type FootballMode = (typeof FOOTBALL_MODES)[number];

export const FIELDS_OPTIONS = [2, 3, 4, 5] as const;
export const GOALS_OPTIONS = [1, 3, 5, null] as const;
export const TIME_OPTIONS = [null, 5, 10, 15] as const;
export const STEP_OPTIONS = [1, 2] as const;
export const THINK_OPTIONS = [0, 10, 20, 30, 60] as const;
export const CONSULT_OPTIONS = [30, 45, 60, 90] as const;

export interface FootballSettings {
  teams: readonly [TeamConfig, TeamConfig];
  mode: FootballMode;
  rules: FootballRules;
  /** null = no time limit. */
  timeLimitMinutes: number | null;
  /** Thinking time in seconds; 0 = open, ended by the teacher. */
  thinkSeconds: number;
  consultSeconds: number;
  cardPool: CardPoolConfig;
}

export const DEFAULT_FOOTBALL_SETTINGS: FootballSettings = {
  teams: [DEFAULT_TEAMS[0]!, DEFAULT_TEAMS[1]!],
  mode: 'hidden-cards',
  rules: { fieldsPerSide: 3, goalsToWin: 3, stepsPerAward: 1 },
  timeLimitMinutes: null,
  thinkSeconds: 20,
  consultSeconds: 45,
  cardPool: DEFAULT_CARD_POOL,
};

function oneOf<T>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

export function sanitizeFootballSettings(raw: unknown): FootballSettings {
  const d = DEFAULT_FOOTBALL_SETTINGS;
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const teams = Array.isArray(src.teams) ? src.teams : [];
  const rules = src.rules !== null && typeof src.rules === 'object' ? (src.rules as Record<string, unknown>) : {};
  const a = sanitizeTeam(teams[0], d.teams[0]);
  let b = sanitizeTeam(teams[1], d.teams[1]);
  if (teamsClash(a, b)) b = DEFAULT_TEAMS.find((t) => !teamsClash(a, t)) ?? d.teams[1];
  return {
    teams: [a, b],
    mode: oneOf(src.mode, FOOTBALL_MODES, d.mode),
    rules: {
      fieldsPerSide: oneOf(rules.fieldsPerSide, FIELDS_OPTIONS, d.rules.fieldsPerSide),
      goalsToWin: oneOf(rules.goalsToWin, GOALS_OPTIONS, d.rules.goalsToWin),
      stepsPerAward: oneOf(rules.stepsPerAward, STEP_OPTIONS, d.rules.stepsPerAward),
    },
    timeLimitMinutes: oneOf(src.timeLimitMinutes, TIME_OPTIONS, d.timeLimitMinutes),
    thinkSeconds: oneOf(src.thinkSeconds, THINK_OPTIONS, d.thinkSeconds),
    consultSeconds: oneOf(src.consultSeconds, CONSULT_OPTIONS, d.consultSeconds),
    cardPool: sanitizeCardPool(src.cardPool),
  };
}

export const footballSettingsStore = persistedSettings('settings:game:football:v1', sanitizeFootballSettings);
