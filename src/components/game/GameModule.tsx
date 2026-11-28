import { useState, type ComponentType } from 'react';
import type { PersistedSettings } from '../../core/settings/persistedSettings';

interface SetupProps<S> {
  initial: S;
  onStart: (settings: S) => void;
}

interface GameProps<S> {
  settings: S;
  onRematch: () => void;
  onSetup: () => void;
  onExit: () => void;
}

interface Props<S> {
  store: PersistedSettings<S>;
  sanitize: (raw: unknown) => S;
  Setup: ComponentType<SetupProps<S>>;
  Game: ComponentType<GameProps<S>>;
  onExit: () => void;
}

/** Common module flow of every game: setup (last settings) → match → rematch / back to setup. */
export function GameModule<S>({ store, sanitize, Setup, Game, onExit }: Props<S>) {
  const [settings, setSettings] = useState<S>(() => store.load());
  const [playing, setPlaying] = useState(false);
  const [match, setMatch] = useState(0);

  if (!playing) {
    return (
      <Setup
        initial={settings}
        onStart={(chosen) => {
          const clean = sanitize(chosen);
          store.save(clean);
          setSettings(clean);
          setMatch((m) => m + 1);
          setPlaying(true);
        }}
      />
    );
  }

  return <Game key={match} settings={settings} onRematch={() => setMatch((m) => m + 1)} onSetup={() => setPlaying(false)} onExit={onExit} />;
}
