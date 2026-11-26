import { getBrowserStorage, readJson, removeKey, writeJson, type KeyValueStorage } from '../storage/localStore';

/** Last-used settings of a game: always read through the game's sanitizer. */
export interface PersistedSettings<T> {
  load(): T;
  save(value: T): boolean;
  clear(): void;
}

export function persistedSettings<T>(
  key: string,
  sanitize: (raw: unknown) => T,
  storage: KeyValueStorage | undefined = getBrowserStorage(),
): PersistedSettings<T> {
  return {
    load: () => sanitize(readJson(storage, key)),
    save: (value) => writeJson(storage, key, value),
    clear: () => removeKey(storage, key),
  };
}
