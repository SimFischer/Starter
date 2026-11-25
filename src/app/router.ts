import { useSyncExternalStore } from 'react';

/**
 * Minimal hash router. Hash URLs work on GitHub Pages sub-paths without
 * server rewrites, so no router dependency is needed.
 */
export type RouteName = 'home' | 'library' | 'prompts' | 'settings';

export const ROUTE_PATHS: Readonly<Record<RouteName, string>> = {
  home: '#/',
  library: '#/fragenbibliothek',
  prompts: '#/ki-prompts',
  settings: '#/einstellungen',
};

function normalizePath(hash: string): string {
  return hash.replace(/^#/, '').replace(/\/+$/, '').toLowerCase() || '/';
}

const ROUTE_BY_PATH = new Map<string, RouteName>(
  (Object.entries(ROUTE_PATHS) as [RouteName, string][]).map(([name, path]) => [normalizePath(path), name]),
);

/** Unknown hashes fall back to the home screen instead of an error page. */
export function parseRoute(hash: string): RouteName {
  return ROUTE_BY_PATH.get(normalizePath(hash)) ?? 'home';
}

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}

export function useRoute(): RouteName {
  return useSyncExternalStore(
    subscribe,
    () => parseRoute(window.location.hash),
    () => 'home',
  );
}
