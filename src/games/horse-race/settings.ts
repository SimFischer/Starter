import { DEFAULT_ANSWER_TIMES, oneOf, sanitizeAnswerSettings, type AnswerSettings } from '../../core/answer-modes/answerSettings';
import type { AnswerModeId } from '../../core/answer-modes/answerModes';
import { persistedSettings } from '../../core/settings/persistedSettings';
import { DEFAULT_TEAMS, sanitizeTeams, type TeamConfig } from '../../core/teams/teams';
import type { HorseRaceRules } from './logic';

export const RACE_MODES = ['hidden-cards', 'team-consult', 'open-round', 'free-control'] as const satisfies readonly AnswerModeId[];
export type RaceMode = (typeof RACE_MODES)[number];

export const TRACK_OPTIONS = [6, 8, 10, 12, 15] as const;
export const RACE_STEP_OPTIONS = [1, 2] as const;
export const RACE_TIME_OPTIONS = [null, 5, 10, 15] as const;
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 4;

export interface HorseRaceSettings extends AnswerSettings<RaceMode> {
  teams: readonly TeamConfig[];
  rules: HorseRaceRules;
  timeLimitMinutes: number | null;
}

export const DEFAULT_RACE_SETTINGS: HorseRaceSettings = {
  teams: DEFAULT_TEAMS.slice(0, 2),
  mode: 'hidden-cards',
  ...DEFAULT_ANSWER_TIMES,
  rules: { trackLength: 10, stepsPerAward: 1 },
  timeLimitMinutes: null,
};

export function sanitizeRaceSettings(raw: unknown): HorseRaceSettings {
  const d = DEFAULT_RACE_SETTINGS;
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rules = src.rules !== null && typeof src.rules === 'object' ? (src.rules as Record<string, unknown>) : {};
  return {
    ...sanitizeAnswerSettings(src, RACE_MODES, d.mode),
    teams: sanitizeTeams(src.teams, MIN_TEAMS, MAX_TEAMS),
    rules: {
      trackLength: oneOf(rules.trackLength, TRACK_OPTIONS, d.rules.trackLength),
      stepsPerAward: oneOf(rules.stepsPerAward, RACE_STEP_OPTIONS, d.rules.stepsPerAward),
    },
    timeLimitMinutes: oneOf(src.timeLimitMinutes, RACE_TIME_OPTIONS, d.timeLimitMinutes),
  };
}

export const raceSettingsStore = persistedSettings('settings:game:horse-race:v1', sanitizeRaceSettings);
