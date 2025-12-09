import { app, ipcMain } from 'electron';
import { fetchGames, fetchGamesByIds, findGamesByInstallPaths } from '../api';
import { GetGamesParams, Game } from '../../shared/types';
import { getFirstAvailableGamePath, getAllInstalledGamePaths, getAllInstalledSteamGames } from '../game-detector';

export function setupGamesHandlers(): void {
  // Version
  ipcMain.on('get-version', (event) => {
    event.returnValue = app.getVersion();
  });

  // Fetch games with pagination - SYNC тепер, тому що локальна БД
  ipcMain.handle('fetch-games', (_, params: GetGamesParams) => {
    try {
      return fetchGames(params);
    } catch (error) {
      console.error('Error fetching games:', error);
      return { games: [], total: 0, hasMore: false };
    }
  });

  // Fetch games by IDs - SYNC
  ipcMain.handle('fetch-games-by-ids', (_, gameIds: string[]) => {
    try {
      return fetchGamesByIds(gameIds);
    } catch (error) {
      console.error('Error fetching games by IDs:', error);
      return [];
    }
  });

  // Get all installed game paths from the system
  ipcMain.handle('get-all-installed-game-paths', async () => {
    try {
      return getAllInstalledGamePaths();
    } catch (error) {
      console.error('Error getting installed game paths:', error);
      return [];
    }
  });

  // Get all installed Steam games
  ipcMain.handle('get-all-installed-steam-games', async () => {
    try {
      const steamGames = getAllInstalledSteamGames();
      // Convert Map to Object for IPC
      return Object.fromEntries(steamGames);
    } catch (error) {
      console.error('Error getting installed Steam games:', error);
      return {};
    }
  });

  // Find games by install paths - SYNC
  ipcMain.handle('find-games-by-install-paths', (_, installPaths: string[]) => {
    try {
      return findGamesByInstallPaths(installPaths);
    } catch (error) {
      console.error('Error finding games by install paths:', error);
      return { games: [], total: 0 };
    }
  });

  // Launch game
  ipcMain.handle('launch-game', async (_, game: Game) => {
    try {
      console.log('[LaunchGame] Request to launch game:', game.name, '(', game.id, ')');
      console.log('[LaunchGame] Game install paths:', JSON.stringify(game.install_paths, null, 2));

      const gamePath = getFirstAvailableGamePath(game.install_paths || []);

      if (!gamePath || !gamePath.exists) {
        console.error('[LaunchGame] Game not found on system');
        return {
          success: false,
          error: 'Гру не знайдено на вашому комп\'ютері',
        };
      }

      console.log('[LaunchGame] Launching game:', game.name, 'at', gamePath.path, 'platform:', gamePath.platform);

      // For Steam games, try to launch via Steam protocol
      if (gamePath.platform === 'steam') {
        // Try to find Steam App ID from the game path
        const { findSteamAppId } = await import('../game-launcher');
        const appId = await findSteamAppId(gamePath.path);

        if (appId) {
          console.log('[LaunchGame] Launching via Steam protocol with App ID:', appId);
          const { shell } = await import('electron');
          await shell.openExternal(`steam://rungameid/${appId}`);
          return { success: true };
        }
      }

      // Fallback: launch executable directly
      const { launchGameExecutable } = await import('../game-launcher');
      await launchGameExecutable(gamePath.path);

      return { success: true };
    } catch (error) {
      console.error('[LaunchGame] Error launching game:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Не вдалося запустити гру',
      };
    }
  });
}

