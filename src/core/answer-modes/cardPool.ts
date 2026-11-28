/**
 * Card pool for the hidden card duel (docs/PEDAGOGY.md).
 * The app only knows which VALUES were handed out – never which child holds
 * which card. All holders of a drawn value (one per team suit) may answer.
 */
export type CardSystem = 'classic' | 'numbers';

export const CLASSIC_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'B', 'D', 'K', 'A'] as const;
export type ClassicRank = (typeof CLASSIC_RANKS)[number];

const RANK_PLURAL: Readonly<Record<ClassicRank, string>> = {
  '2': 'Zweien',
  '3': 'Dreien',
  '4': 'Vieren',
  '5': 'Fünfen',
  '6': 'Sechsen',
  '7': 'Siebenen',
  '8': 'Achten',
  '9': 'Neunen',
  '10': 'Zehnen',
  B: 'Buben',
  D: 'Damen',
  K: 'Könige',
  A: 'Asse',
};

export const RANK_NAME: Readonly<Record<ClassicRank, string>> = {
  '2': 'Zwei', '3': 'Drei', '4': 'Vier', '5': 'Fünf', '6': 'Sechs', '7': 'Sieben', '8': 'Acht',
  '9': 'Neun', '10': 'Zehn', B: 'Bube', D: 'Dame', K: 'König', A: 'Ass',
};

export const NUMBER_MAX_LIMIT = 40;

export interface CardPoolConfig {
  system: CardSystem;
  /** Classic ranks the teacher actually handed out. */
  classicRanks: readonly ClassicRank[];
  /** Numbered cards 1…numberMax. */
  numberMax: number;
  withReplacement: boolean;
  /** Reshuffle automatically once every value has been drawn. */
  autoReset: boolean;
}

export const DEFAULT_CARD_POOL: Readonly<CardPoolConfig> = {
  system: 'classic',
  classicRanks: CLASSIC_RANKS,
  numberMax: 15,
  withReplacement: false,
  autoReset: true,
};

export function poolValues(config: CardPoolConfig): string[] {
  if (config.system === 'numbers') return Array.from({ length: config.numberMax }, (_, i) => String(i + 1));
  return CLASSIC_RANKS.filter((r) => config.classicRanks.includes(r));
}

export interface CardPoolState {
  /** Values that can still be drawn (relevant without replacement). */
  remaining: readonly string[];
}

export function createPoolState(config: CardPoolConfig): CardPoolState {
  return { remaining: poolValues(config) };
}

export interface DrawResult {
  value: string;
  state: CardPoolState;
  reshuffled: boolean;
}

/**
 * Draws a random value. `exclude` prevents revealing a value twice within one
 * round (e.g. when the teacher releases a further value).
 * Returns null if nothing can be drawn (pool empty and no auto reset).
 */
export function drawCard(
  config: CardPoolConfig,
  state: CardPoolState,
  exclude: readonly string[] = [],
  random: () => number = Math.random,
): DrawResult | null {
  const all = poolValues(config);
  let source = config.withReplacement ? all : state.remaining;
  let candidates = source.filter((v) => !exclude.includes(v));
  let reshuffled = false;

  if (candidates.length === 0 && !config.withReplacement && config.autoReset) {
    source = all;
    candidates = all.filter((v) => !exclude.includes(v));
    reshuffled = true;
  }
  if (candidates.length === 0) return null;

  const value = candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))]!;
  if (config.withReplacement) return { value, state, reshuffled };
  return { value, state: { remaining: source.filter((v) => v !== value) }, reshuffled };
}

/** Manual choice by the teacher; removes the value from the pool if present. */
export function pickCard(config: CardPoolConfig, state: CardPoolState, value: string): CardPoolState {
  if (config.withReplacement) return state;
  return { remaining: state.remaining.filter((v) => v !== value) };
}

/** Classroom callout, e.g. "Die Siebenen antworten!" */
export function answerCallout(system: CardSystem, value: string): string {
  if (system === 'classic' && value in RANK_PLURAL) return `Die ${RANK_PLURAL[value as ClassicRank]} antworten!`;
  return `Die Nummer ${value} antwortet!`;
}

export function sanitizeCardPool(raw: unknown): CardPoolConfig {
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const ranks = Array.isArray(src.classicRanks)
    ? CLASSIC_RANKS.filter((r) => (src.classicRanks as unknown[]).includes(r))
    : [...DEFAULT_CARD_POOL.classicRanks];
  const max = typeof src.numberMax === 'number' && Number.isFinite(src.numberMax) ? Math.round(src.numberMax) : DEFAULT_CARD_POOL.numberMax;
  return {
    system: src.system === 'numbers' ? 'numbers' : 'classic',
    classicRanks: ranks.length >= 2 ? ranks : [...DEFAULT_CARD_POOL.classicRanks],
    numberMax: Math.min(NUMBER_MAX_LIMIT, Math.max(2, max)),
    withReplacement: typeof src.withReplacement === 'boolean' ? src.withReplacement : DEFAULT_CARD_POOL.withReplacement,
    autoReset: typeof src.autoReset === 'boolean' ? src.autoReset : DEFAULT_CARD_POOL.autoReset,
  };
}
