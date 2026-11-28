import { GameModule } from '../../components/game/GameModule';
import type { GameScreenProps } from '../../core/games/types';
import { FootballGame } from './FootballGame';
import { FootballSetup } from './FootballSetup';
import { footballSettingsStore, sanitizeFootballSettings } from './settings';

/** Entry point of the Tafelfußball module (lazy loaded via the registry). */
export default function FootballModule({ onExit }: GameScreenProps) {
  return <GameModule store={footballSettingsStore} sanitize={sanitizeFootballSettings} Setup={FootballSetup} Game={FootballGame} onExit={onExit} />;
}
