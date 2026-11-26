import { useState } from 'react';
import type { GameScreenProps } from '../../core/games/types';
import { FootballGame } from './FootballGame';
import { FootballSetup } from './FootballSetup';
import { footballSettingsStore, sanitizeFootballSettings, type FootballSettings } from './settings';

/** Entry point of the Tafelfußball module: setup → match → result. */
export default function FootballModule({ onExit }: GameScreenProps) {
  const [settings, setSettings] = useState<FootballSettings>(() => footballSettingsStore.load());
  const [playing, setPlaying] = useState(false);
  const [match, setMatch] = useState(0);

  if (!playing) {
    return (
      <FootballSetup
        initial={settings}
        onStart={(chosen) => {
          const clean = sanitizeFootballSettings(chosen);
          footballSettingsStore.save(clean);
          setSettings(clean);
          setMatch((m) => m + 1);
          setPlaying(true);
        }}
      />
    );
  }

  return (
    <FootballGame
      key={match}
      settings={settings}
      onRematch={() => setMatch((m) => m + 1)}
      onSetup={() => setPlaying(false)}
      onExit={onExit}
    />
  );
}
