import { DEFAULT_ANSWER_TIMES, oneOf, sanitizeAnswerSettings, type AnswerSettings } from '../../core/answer-modes/answerSettings';
import type { AnswerModeId } from '../../core/answer-modes/answerModes';
import { persistedSettings } from '../../core/settings/persistedSettings';
import { DEFAULT_TEAMS, sanitizeTeams, type TeamConfig } from '../../core/teams/teams';
import type { ConnectFourRules, TurnMode } from './logic';

export const C4_MODES = ['hidden-cards', 'team-consult', 'open-round', 'free-control'] as const satisfies readonly AnswerModeId[];
export type C4Mode = (typeof C4_MODES)[number];

/** Board sizes as "cols×rows". */
export const BOARD_OPTIONS = ['6x5', '7x6', '8x7'] as const;
export type BoardSize = (typeof BOARD_OPTIONS)[number];
export const TURN_OPTIONS: readonly TurnMode[] = ['earn', 'alternate'];

export interface ConnectFourSettings extends AnswerSettings<C4Mode> {
  teams: readonly [TeamConfig, TeamConfig];
  board: BoardSize;
  turnMode: TurnMode;
}

export const DEFAULT_C4_SETTINGS: ConnectFourSettings = {
  teams: [DEFAULT_TEAMS[0]!, DEFAULT_TEAMS[1]!],
  mode: 'team-consult',
  ...DEFAULT_ANSWER_TIMES,
  board: '7x6',
  turnMode: 'earn',
};

export function rulesOf(settings: ConnectFourSettings): ConnectFourRules {
  const [cols, rows] = settings.board.split('x').map(Number) as [number, number];
  return { cols, rows, turnMode: settings.turnMode };
}

export function sanitizeC4Settings(raw: unknown): ConnectFourSettings {
  const d = DEFAULT_C4_SETTINGS;
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const [a, b] = sanitizeTeams(src.teams, 2, 2);
  return {
    ...sanitizeAnswerSettings(src, C4_MODES, d.mode),
    teams: [a!, b!],
    board: oneOf(src.board, BOARD_OPTIONS, d.board),
    turnMode: oneOf(src.turnMode, TURN_OPTIONS, d.turnMode),
  };
}

export const c4SettingsStore = persistedSettings('settings:game:connect-four:v1', sanitizeC4Settings);
