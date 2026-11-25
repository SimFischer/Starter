import { GAME_DEFINITIONS } from '../../games/definitions';
import type { GameDefinition, GameId, PlayStyle } from './types';

export const PLAY_STYLE_LABEL: Readonly<Record<PlayStyle, string>> = {
  competitive: 'Kompetitiv',
  cooperative: 'Kooperativ',
  flexible: 'Kooperativ oder kompetitiv',
};

const BY_ID = new Map<GameId, GameDefinition>(GAME_DEFINITIONS.map((g) => [g.id, g]));

export function listGames(): readonly GameDefinition[] {
  return GAME_DEFINITIONS;
}

export function getGame(id: GameId): GameDefinition | undefined {
  return BY_ID.get(id);
}

/** Human-readable team info, e.g. "2–4 Mannschaften" or "Ganze Klasse". */
export function describeTeams(game: GameDefinition): string {
  if (!game.teams) return 'Ganze Klasse';
  const { min, max } = game.teams;
  const range = min === max ? `${min}` : `${min}–${max}`;
  return game.playStyle === 'flexible' ? `Klasse oder ${range} Mannschaften` : `${range} Mannschaften`;
}
