import { useEffect } from 'react';
import { AppHeader } from '../components/layout/AppHeader';
import { UI_SCALE_FACTOR } from '../core/settings/appSettings';
import { useAppSettings } from '../core/settings/useAppSettings';
import { useFullscreen } from '../hooks/useFullscreen';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { HomePage } from './pages/HomePage';
import { LIBRARY_FEATURE, PROMPT_FEATURE, PlannedFeaturePage } from './pages/PlannedFeaturePage';
import { SettingsPage } from './pages/SettingsPage';
import { useRoute, type RouteName } from './router';
import styles from './App.module.css';

const TITLES: Record<RouteName, string> = {
  home: 'TafelArena – Spielesammlung',
  library: 'Fragenbibliothek · TafelArena',
  prompts: 'KI-Prompt-Generator · TafelArena',
  settings: 'Einstellungen · TafelArena',
};

function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

export function App() {
  const route = useRoute();
  const settings = useAppSettings();
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { toggle: toggleFullscreen } = useFullscreen();

  const reducedMotion = settings.motion === 'reduced' || (settings.motion === 'system' && systemReduced);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = reducedMotion ? 'reduced' : 'full';
    root.style.setProperty('--ui-scale', String(UI_SCALE_FACTOR[settings.uiScale]));
  }, [reducedMotion, settings.uiScale]);

  useEffect(() => {
    document.title = TITLES[route];
    window.scrollTo(0, 0);
  }, [route]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target)) return;
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        void toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleFullscreen]);

  return (
    <div className={styles.shell}>
      <div className="arena-backdrop" aria-hidden="true" />
      <a href="#main" className={styles.skip} onClick={(e) => {
        e.preventDefault();
        document.getElementById('main')?.focus();
      }}>
        Zum Inhalt springen
      </a>
      <AppHeader route={route} />
      {route === 'home' && <HomePage />}
      {route === 'library' && <PlannedFeaturePage feature={LIBRARY_FEATURE} />}
      {route === 'prompts' && <PlannedFeaturePage feature={PROMPT_FEATURE} />}
      {route === 'settings' && <SettingsPage />}
    </div>
  );
}
