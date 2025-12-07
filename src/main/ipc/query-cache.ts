import { ipcMain, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const QUERY_CACHE_FILE = 'query-cache.json';

export function setupQueryCacheHandlers(): void {
  // Save query cache
  ipcMain.handle('save-query-cache', async (_, cacheData: string) => {
    try {
      const userDataPath = app.getPath('userData');
      const cacheDir = path.join(userDataPath, 'cache');

      // Create cache directory if it doesn't exist
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const cachePath = path.join(cacheDir, QUERY_CACHE_FILE);
      await fs.promises.writeFile(cachePath, cacheData, 'utf-8');
      console.log('[QueryCache] Cache saved successfully');
    } catch (error) {
      console.error('[QueryCache] Error saving cache:', error);
      throw error;
    }
  });

  // Load query cache
  ipcMain.handle('load-query-cache', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const cachePath = path.join(userDataPath, 'cache', QUERY_CACHE_FILE);

      if (!fs.existsSync(cachePath)) {
        console.log('[QueryCache] No cache file found');
        return null;
      }

      const cacheData = await fs.promises.readFile(cachePath, 'utf-8');
      console.log('[QueryCache] Cache loaded successfully');
      return cacheData;
    } catch (error) {
      console.error('[QueryCache] Error loading cache:', error);
      return null;
    }
  });

  // Remove query cache
  ipcMain.handle('remove-query-cache', async () => {
    try {
      const userDataPath = app.getPath('userData');
      const cachePath = path.join(userDataPath, 'cache', QUERY_CACHE_FILE);

      if (fs.existsSync(cachePath)) {
        await fs.promises.unlink(cachePath);
        console.log('[QueryCache] Cache removed successfully');
      }
    } catch (error) {
      console.error('[QueryCache] Error removing cache:', error);
      throw error;
    }
  });
}
