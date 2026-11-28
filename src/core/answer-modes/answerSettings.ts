import type { AnswerModeId } from './answerModes';
import { DEFAULT_CARD_POOL, sanitizeCardPool, type CardPoolConfig } from './cardPool';

/** Answer-mode settings shared by all team games (stored flat inside each game's settings). */
export interface AnswerSettings<M extends AnswerModeId = AnswerModeId> {
  mode: M;
  /** Thinking time in seconds; 0 = open, ended by the teacher. */
  thinkSeconds: number;
  consultSeconds: number;
  cardPool: CardPoolConfig;
}

export const THINK_OPTIONS = [0, 10, 20, 30, 60] as const;
export const CONSULT_OPTIONS = [30, 45, 60, 90] as const;

export const DEFAULT_ANSWER_TIMES = { thinkSeconds: 20, consultSeconds: 45, cardPool: DEFAULT_CARD_POOL } as const;

export function oneOf<T>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

export function sanitizeAnswerSettings<M extends AnswerModeId>(
  src: Record<string, unknown>,
  modes: readonly M[],
  defaultMode: M,
): AnswerSettings<M> {
  return {
    mode: oneOf(src.mode, modes, defaultMode),
    thinkSeconds: oneOf(src.thinkSeconds, THINK_OPTIONS, DEFAULT_ANSWER_TIMES.thinkSeconds),
    consultSeconds: oneOf(src.consultSeconds, CONSULT_OPTIONS, DEFAULT_ANSWER_TIMES.consultSeconds),
    cardPool: sanitizeCardPool(src.cardPool),
  };
}
