import { describe, expect, it } from 'vitest';
import {
  APP_SETTINGS_KEY,
  DEFAULT_APP_SETTINGS,
  createSettingsStore,
  sanitizeAppSettings,
} from '../src/core/settings/appSettings';
import { STORAGE_PREFIX, type KeyValueStorage } from '../src/core/storage/localStore';

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const failingStorage: KeyValueStorage = {
  getItem: () => {
    throw new Error('denied');
  },
  setItem: () => {
    throw new Error('quota');
  },
  removeItem: () => {
    throw new Error('denied');
  },
};

describe('sanitizeAppSettings', () => {
  it('returns defaults for garbage input', () => {
    for (const raw of [undefined, null, 42, 'x', [], { motion: 'turbo', uiScale: 7 }]) {
      expect(sanitizeAppSettings(raw)).toEqual(DEFAULT_APP_SETTINGS);
    }
  });

  it('keeps valid values and drops unknown keys', () => {
    expect(sanitizeAppSettings({ motion: 'reduced', uiScale: 'xlarge', evil: '<script>' })).toEqual({
      motion: 'reduced',
      uiScale: 'xlarge',
    });
  });
});

describe('createSettingsStore', () => {
  it('loads, updates, persists and notifies', () => {
    const storage = memoryStorage({ [STORAGE_PREFIX + APP_SETTINGS_KEY]: JSON.stringify({ motion: 'full' }) });
    const store = createSettingsStore(storage);
    expect(store.get()).toEqual({ motion: 'full', uiScale: 'standard' });

    let calls = 0;
    store.subscribe(() => calls++);
    store.update({ uiScale: 'large' });
    store.update({ uiScale: 'large' }); // no-op
    expect(calls).toBe(1);
    expect(JSON.parse(storage.data.get(STORAGE_PREFIX + APP_SETTINGS_KEY) ?? '{}')).toEqual({ motion: 'full', uiScale: 'large' });
  });

  it('reset restores defaults and clears storage', () => {
    const storage = memoryStorage();
    const store = createSettingsStore(storage);
    store.update({ motion: 'reduced' });
    store.reset();
    expect(store.get()).toEqual(DEFAULT_APP_SETTINGS);
    expect(storage.data.size).toBe(0);
  });

  it('survives corrupt JSON and unavailable storage', () => {
    expect(createSettingsStore(memoryStorage({ [STORAGE_PREFIX + APP_SETTINGS_KEY]: '{oops' })).get()).toEqual(DEFAULT_APP_SETTINGS);
    const store = createSettingsStore(failingStorage);
    store.update({ motion: 'reduced' });
    expect(store.get().motion).toBe('reduced');
    expect(store.isPersisted()).toBe(false);
    expect(() => store.reset()).not.toThrow();
  });
});
