import { GameModule } from '../../components/game/GameModule';
import type { GameScreenProps } from '../../core/games/types';
import { ConnectFourGame } from './ConnectFourGame';
import { ConnectFourSetup } from './ConnectFourSetup';
import { c4SettingsStore, sanitizeC4Settings } from './settings';

/** Entry point of the Vier-gewinnt module (lazy loaded via the registry). */
export default function ConnectFourModule({ onExit }: GameScreenProps) {
  return <GameModule store={c4SettingsStore} sanitize={sanitizeC4Settings} Setup={ConnectFourSetup} Game={ConnectFourGame} onExit={onExit} />;
}
