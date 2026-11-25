/**
 * Thin, failure-tolerant wrapper around Web Storage.
 * Storage can be unavailable (privacy modes, quota, disabled cookies);
 * callers always receive a defined result and the app never crashes.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const STORAGE_PREFIX = 'tafelarena:';

export function getBrowserStorage(): KeyValueStorage | undefined {
  try {
    return typeof window !== 'undefined' ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
}

export function readJson(storage: KeyValueStorage | undefined, key: string): unknown {
  if (!storage) return undefined;
  try {
    const raw = storage.getItem(STORAGE_PREFIX + key);
    return raw === null ? undefined : (JSON.parse(raw) as unknown);
  } catch {
    return undefined;
  }
}

/** Returns false when the value could not be persisted. */
export function writeJson(storage: KeyValueStorage | undefined, key: string, value: unknown): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(storage: KeyValueStorage | undefined, key: string): void {
  try {
    storage?.removeItem(STORAGE_PREFIX + key);
  } catch {
    /* ignore – nothing to clean up */
  }
}
