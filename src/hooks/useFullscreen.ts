import { useCallback, useSyncExternalStore } from 'react';

function subscribe(listener: () => void) {
  document.addEventListener('fullscreenchange', listener);
  return () => document.removeEventListener('fullscreenchange', listener);
}

const isActive = () => document.fullscreenElement !== null;

export function isFullscreenSupported(): boolean {
  return typeof document !== 'undefined' && document.fullscreenEnabled === true;
}

export function useFullscreen() {
  const active = useSyncExternalStore(subscribe, isActive, () => false);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    } catch {
      /* Browser refused (e.g. no user gesture or policy) – UI simply stays as it is. */
    }
  }, []);

  return { supported: isFullscreenSupported(), active, toggle };
}
