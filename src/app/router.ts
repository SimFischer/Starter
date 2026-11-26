import { useSyncExternalStore } from 'react';

/**
 * Minimal hash router. Hash URLs work on GitHub Pages sub-paths without
 * server rewrites, so no router dependency is needed.
 */
export type RouteName = 'home' | 'library' | 'prompts' | 'settings';

export type Route = { name: RouteName } | { name: 'game'; gameId: string };

export const ROUTE_PATHS: Readonly<Record<RouteName, string>> = {
  home: '#/',
  library: '#/fragenbibliothek',
  prompts: '#/ki-prompts',
  settings: '#/einstellungen',
};

const GAME_PREFIX = '/spiel/';

export function gamePath(gameId: string): string {
  return `#${GAME_PREFIX}${gameId}`;
}

function normalizePath(hash: string): string {
  return hash.replace(/^#/, '').replace(/\/+$/, '').toLowerCase() || '/';
}

const ROUTE_BY_PATH = new Map<string, RouteName>(
  (Object.entries(ROUTE_PATHS) as [RouteName, string][]).map(([name, path]) => [normalizePath(path), name]),
);

/**
 * Unknown hashes fall back to the home screen instead of an error page.
 * Game ids are validated by the game page against the registry.
 */
export function parseRoute(hash: string): Route {
  const path = normalizePath(hash);
  if (path.startsWith(GAME_PREFIX) && path.length > GAME_PREFIX.length) {
    return { name: 'game', gameId: path.slice(GAME_PREFIX.length) };
  }
  return { name: ROUTE_BY_PATH.get(path) ?? 'home' };
}

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}

/** Current hash (a stable primitive for useSyncExternalStore); parse with parseRoute. */
export function useHash(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '');
}
