import { useSyncExternalStore } from 'react';
import { getBrowserStorage } from '../storage/localStore';
import { createSettingsStore, type AppSettings } from './appSettings';

export const appSettingsStore = createSettingsStore(getBrowserStorage());

export function useAppSettings(): AppSettings {
  return useSyncExternalStore(appSettingsStore.subscribe, appSettingsStore.get, appSettingsStore.get);
}
