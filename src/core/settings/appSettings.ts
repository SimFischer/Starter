import { readJson, removeKey, writeJson, type KeyValueStorage } from '../storage/localStore';

/** App-wide settings. Game-specific settings live with each game module (Phase 2+). */
export type MotionPreference = 'system' | 'full' | 'reduced';
export type UiScale = 'standard' | 'large' | 'xlarge';

export interface AppSettings {
  motion: MotionPreference;
  uiScale: UiScale;
}

export const DEFAULT_APP_SETTINGS: Readonly<AppSettings> = Object.freeze({
  motion: 'system',
  uiScale: 'standard',
});

export const UI_SCALE_FACTOR: Readonly<Record<UiScale, number>> = {
  standard: 1,
  large: 1.1,
  xlarge: 1.2,
};

const MOTION_VALUES: readonly MotionPreference[] = ['system', 'full', 'reduced'];
const SCALE_VALUES: readonly UiScale[] = ['standard', 'large', 'xlarge'];

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Accepts anything (e.g. stale or manipulated storage) and returns valid settings. */
export function sanitizeAppSettings(raw: unknown): AppSettings {
  const source = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  return {
    motion: pick(source.motion, MOTION_VALUES, DEFAULT_APP_SETTINGS.motion),
    uiScale: pick(source.uiScale, SCALE_VALUES, DEFAULT_APP_SETTINGS.uiScale),
  };
}

export const APP_SETTINGS_KEY = 'settings:app:v1';

export interface SettingsStore {
  get(): AppSettings;
  subscribe(listener: () => void): () => void;
  update(patch: Partial<AppSettings>): void;
  reset(): void;
  /** False if the last write could not be persisted (settings still apply for this session). */
  isPersisted(): boolean;
}

export function createSettingsStore(storage: KeyValueStorage | undefined): SettingsStore {
  let current = sanitizeAppSettings(readJson(storage, APP_SETTINGS_KEY));
  let persisted = true;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  return {
    get: () => current,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    update(patch) {
      const next = sanitizeAppSettings({ ...current, ...patch });
      if (next.motion === current.motion && next.uiScale === current.uiScale) return;
      current = next;
      persisted = writeJson(storage, APP_SETTINGS_KEY, current);
      emit();
    },
    reset() {
      current = { ...DEFAULT_APP_SETTINGS };
      removeKey(storage, APP_SETTINGS_KEY);
      persisted = true;
      emit();
    },
    isPersisted: () => persisted,
  };
}
