import { Suspense, lazy, useMemo } from 'react';
import { listGames } from '../../core/games/registry';
import { ROUTE_PATHS } from '../router';
import { ButtonLink } from '../../components/ui/Button';
import styles from './GamePage.module.css';

const exit = () => {
  window.location.hash = ROUTE_PATHS.home;
};

/** Loads a playable game module on demand (code splitting per game). */
export function GamePage({ gameId }: { gameId: string }) {
  const game = listGames().find((g) => g.id === gameId);
  const Screen = useMemo(() => (game?.load ? lazy(game.load) : null), [game]);

  if (!game || !Screen) {
    return (
      <main className={styles.message} id="main" tabIndex={-1}>
        <h1>{game ? `${game.title} ist noch in Entwicklung.` : 'Dieses Spiel gibt es nicht.'}</h1>
        <ButtonLink href={ROUTE_PATHS.home} variant="primary" size="lg" icon="back">
          Zur Spielesammlung
        </ButtonLink>
      </main>
    );
  }

  return (
    <Suspense fallback={<div className={styles.loading} role="status">{game.title} wird geladen …</div>}>
      <Screen onExit={exit} />
    </Suspense>
  );
}
