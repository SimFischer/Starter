import { DEFAULT_ANSWER_TIMES, oneOf, sanitizeAnswerSettings, type AnswerSettings } from '../../core/answer-modes/answerSettings';
import type { AnswerModeId } from '../../core/answer-modes/answerModes';
import { persistedSettings } from '../../core/settings/persistedSettings';
import { DEFAULT_TEAMS, sanitizeTeams, type TeamConfig } from '../../core/teams/teams';
import type { FootballRules } from './logic';

export const FOOTBALL_MODES = ['hidden-cards', 'team-consult', 'open-round', 'free-control'] as const satisfies readonly AnswerModeId[];
export type FootballMode = (typeof FOOTBALL_MODES)[number];

export const FIELDS_OPTIONS = [2, 3, 4, 5] as const;
export const GOALS_OPTIONS = [1, 3, 5, null] as const;
export const TIME_OPTIONS = [null, 5, 10, 15] as const;
export const STEP_OPTIONS = [1, 2] as const;

export interface FootballSettings extends AnswerSettings<FootballMode> {
  teams: readonly [TeamConfig, TeamConfig];
  rules: FootballRules;
  /** null = no time limit. */
  timeLimitMinutes: number | null;
}

export const DEFAULT_FOOTBALL_SETTINGS: FootballSettings = {
  teams: [DEFAULT_TEAMS[0]!, DEFAULT_TEAMS[1]!],
  mode: 'hidden-cards',
  ...DEFAULT_ANSWER_TIMES,
  rules: { fieldsPerSide: 3, goalsToWin: 3, stepsPerAward: 1 },
  timeLimitMinutes: null,
};

export function sanitizeFootballSettings(raw: unknown): FootballSettings {
  const d = DEFAULT_FOOTBALL_SETTINGS;
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rules = src.rules !== null && typeof src.rules === 'object' ? (src.rules as Record<string, unknown>) : {};
  const [a, b] = sanitizeTeams(src.teams, 2, 2);
  return {
    ...sanitizeAnswerSettings(src, FOOTBALL_MODES, d.mode),
    teams: [a!, b!],
    rules: {
      fieldsPerSide: oneOf(rules.fieldsPerSide, FIELDS_OPTIONS, d.rules.fieldsPerSide),
      goalsToWin: oneOf(rules.goalsToWin, GOALS_OPTIONS, d.rules.goalsToWin),
      stepsPerAward: oneOf(rules.stepsPerAward, STEP_OPTIONS, d.rules.stepsPerAward),
    },
    timeLimitMinutes: oneOf(src.timeLimitMinutes, TIME_OPTIONS, d.timeLimitMinutes),
  };
}

export const footballSettingsStore = persistedSettings('settings:game:football:v1', sanitizeFootballSettings);
