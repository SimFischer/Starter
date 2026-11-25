import { ROUTE_PATHS, type RouteName } from '../../app/router';
import { useFullscreen } from '../../hooks/useFullscreen';
import { Button } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Wordmark } from './Wordmark';
import styles from './AppHeader.module.css';

interface NavItem {
  route: RouteName;
  label: string;
  icon: IconName;
  planned?: boolean;
}

const NAV: readonly NavItem[] = [
  { route: 'home', label: 'Spiele', icon: 'games' },
  { route: 'library', label: 'Fragenbibliothek', icon: 'library', planned: true },
  { route: 'prompts', label: 'KI-Prompts', icon: 'sparkles', planned: true },
  { route: 'settings', label: 'Einstellungen', icon: 'settings' },
];

export function AppHeader({ route }: { route: RouteName }) {
  const fullscreen = useFullscreen();

  return (
    <header className={styles.header}>
      <a href={ROUTE_PATHS.home} className={styles.brand} aria-label="TafelArena – zur Spielesammlung">
        <Wordmark />
      </a>
      <nav className={styles.nav} aria-label="Hauptnavigation">
        {NAV.map((item) => (
          <a
            key={item.route}
            href={ROUTE_PATHS[item.route]}
            className={styles.navItem}
            aria-current={route === item.route ? 'page' : undefined}
          >
            <Icon name={item.icon} className={styles.navIcon} />
            <span>{item.label}</span>
            {item.planned && <span className={styles.planned}>Geplant</span>}
          </a>
        ))}
      </nav>
      <Button
        variant="secondary"
        icon={fullscreen.active ? 'compress' : 'expand'}
        iconOnly
        onClick={fullscreen.toggle}
        disabled={!fullscreen.supported}
        aria-keyshortcuts="F"
        className={styles.fullscreen}
      >
        {fullscreen.supported
          ? fullscreen.active
            ? 'Vollbild beenden (F)'
            : 'Vollbild (F)'
          : 'Vollbild wird von diesem Browser nicht unterstützt'}
      </Button>
    </header>
  );
}
