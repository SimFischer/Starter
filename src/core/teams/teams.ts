/**
 * Team model shared by all team games. Teams are groups, never individuals:
 * no student names or per-child data are stored anywhere.
 */
export const TEAM_SYMBOLS = ['heart', 'spade', 'diamond', 'club', 'star', 'circle', 'triangle', 'hexagon'] as const;
export type TeamSymbolId = (typeof TEAM_SYMBOLS)[number];

export const TEAM_SYMBOL_LABEL: Readonly<Record<TeamSymbolId, string>> = {
  heart: 'Herz',
  spade: 'Pik',
  diamond: 'Karo',
  club: 'Kreuz',
  star: 'Stern',
  circle: 'Kreis',
  triangle: 'Dreieck',
  hexagon: 'Sechseck',
};

export const TEAM_COLORS = {
  red: { label: 'Rot', value: '#E5484D' },
  blue: { label: 'Blau', value: '#3E8BFF' },
  gold: { label: 'Gold', value: '#E8B95B' },
  violet: { label: 'Violett', value: '#A274FF' },
  orange: { label: 'Orange', value: '#FF8A3D' },
  teal: { label: 'Türkis', value: '#2CC7C0' },
} as const;
export type TeamColorId = keyof typeof TEAM_COLORS;
const COLOR_IDS = Object.keys(TEAM_COLORS) as TeamColorId[];

export interface TeamConfig {
  name: string;
  color: TeamColorId;
  symbol: TeamSymbolId;
}

export const TEAM_NAME_MAX = 22;

/** Defaults follow the hidden card duel: hearts vs. spades (then diamonds, clubs). */
export const DEFAULT_TEAMS: readonly TeamConfig[] = [
  { name: 'Team Herz', color: 'red', symbol: 'heart' },
  { name: 'Team Pik', color: 'blue', symbol: 'spade' },
  { name: 'Team Karo', color: 'gold', symbol: 'diamond' },
  { name: 'Team Kreuz', color: 'violet', symbol: 'club' },
];

export function teamColor(team: TeamConfig): string {
  return TEAM_COLORS[team.color].value;
}

export function sanitizeTeam(raw: unknown, fallback: TeamConfig): TeamConfig {
  const src = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const name = typeof src.name === 'string' ? src.name.replace(/\s+/g, ' ').trim().slice(0, TEAM_NAME_MAX) : '';
  return {
    name: name || fallback.name,
    color: COLOR_IDS.includes(src.color as TeamColorId) ? (src.color as TeamColorId) : fallback.color,
    symbol: TEAM_SYMBOLS.includes(src.symbol as TeamSymbolId) ? (src.symbol as TeamSymbolId) : fallback.symbol,
  };
}

/** True if two teams could be confused (same colour or same symbol). */
export function teamsClash(a: TeamConfig, b: TeamConfig): boolean {
  return a.color === b.color || a.symbol === b.symbol;
}

/**
 * Sanitizes a stored team list to `count` teams (clamped to min…max) that are
 * pairwise distinguishable; clashing teams are replaced by free defaults.
 */
export function sanitizeTeams(raw: unknown, min: number, max: number, defaultCount = min): TeamConfig[] {
  const list = Array.isArray(raw) ? raw : [];
  const count = Math.min(max, Math.max(min, list.length || defaultCount));
  const teams: TeamConfig[] = [];
  for (let i = 0; i < count; i++) {
    let team = sanitizeTeam(list[i], DEFAULT_TEAMS[i] ?? DEFAULT_TEAMS[0]!);
    if (teams.some((t) => teamsClash(t, team))) {
      team = DEFAULT_TEAMS.find((d) => !teams.some((t) => teamsClash(t, d))) ?? team;
    }
    teams.push(team);
  }
  return teams;
}

/** Adds the first default team that does not clash with the existing ones. */
export function nextFreeTeam(teams: readonly TeamConfig[]): TeamConfig {
  return DEFAULT_TEAMS.find((d) => !teams.some((t) => teamsClash(t, d))) ?? DEFAULT_TEAMS[teams.length % DEFAULT_TEAMS.length]!;
}
