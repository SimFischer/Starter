import { GameModule } from '../../components/game/GameModule';
import type { GameScreenProps } from '../../core/games/types';
import { HorseRaceGame } from './HorseRaceGame';
import { HorseRaceSetup } from './HorseRaceSetup';
import { raceSettingsStore, sanitizeRaceSettings } from './settings';

/** Entry point of the Pferderennen module (lazy loaded via the registry). */
export default function HorseRaceModule({ onExit }: GameScreenProps) {
  return <GameModule store={raceSettingsStore} sanitize={sanitizeRaceSettings} Setup={HorseRaceSetup} Game={HorseRaceGame} onExit={onExit} />;
}
