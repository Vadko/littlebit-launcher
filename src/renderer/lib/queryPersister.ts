import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * Persister для React Query який зберігає кеш через Electron IPC
 */
export function createElectronPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await window.electronAPI?.saveQueryCache?.(JSON.stringify(client));
      } catch (error) {
        console.error('[QueryPersister] Error persisting client:', error);
      }
    },
    restoreClient: async () => {
      try {
        const cached = await window.electronAPI?.loadQueryCache?.();
        if (!cached) return undefined;
        return JSON.parse(cached) as PersistedClient;
      } catch (error) {
        console.error('[QueryPersister] Error restoring client:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await window.electronAPI?.removeQueryCache?.();
      } catch (error) {
        console.error('[QueryPersister] Error removing client:', error);
      }
    },
  };
}
