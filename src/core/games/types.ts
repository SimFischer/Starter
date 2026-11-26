import type { ComponentType } from 'react';
import type { AnswerModeId } from '../answer-modes/answerModes';

export type GameId =
  | 'football'
  | 'horse-race'
  | 'connect-four'
  | 'boss-battle'
  | 'jeopardy'
  | 'memory'
  | 'treasure-hunt';

/** competitive: teams play against each other · cooperative: whole class together · flexible: both */
export type PlayStyle = 'competitive' | 'cooperative' | 'flexible';

export type GameStatus = 'in-development' | 'playable';

/** Which content format a game consumes (docs/DATA_SCHEMA.md). */
export type ContentType = 'questions' | 'jeopardy' | 'memory';

export interface GameAccent {
  /** Main accent colour (hex). */
  primary: string;
  /** Secondary accent colour (hex). */
  secondary: string;
}

export interface GameDefinition {
  id: GameId;
  title: string;
  /** Game type, e.g. "Mannschaftsduell". */
  genre: string;
  /** One-line mechanic for the launcher tile. */
  tagline: string;
  /** Short paragraph for the details dialog. */
  description: string;
  playStyle: PlayStyle;
  /** Team count range; null when the whole class plays as one group. */
  teams: { min: number; max: number } | null;
  answerModes: readonly AnswerModeId[];
  contentType: ContentType;
  accent: GameAccent;
  status: GameStatus;
  /** Roadmap phase in which the game becomes playable. */
  plannedPhase: number;
  /** Provisional SVG artwork for the launcher (see docs/ASSETS.md). */
  Illustration: ComponentType;
  /** Lazily loaded game screen; present exactly when status is 'playable'. */
  load?: () => Promise<{ default: ComponentType<GameScreenProps> }>;
}

export interface GameScreenProps {
  /** Leave the game and return to the collection. */
  onExit: () => void;
}
