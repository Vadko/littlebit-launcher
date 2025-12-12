import { ipcMain, dialog, shell } from 'electron';
import { installTranslation, checkInstallation, uninstallTranslation, getAllInstalledGameIds, ManualSelectionError, abortCurrentDownload, removeOrphanedInstallationMetadata, removeComponents } from '../installer';
import { getMainWindow } from '../window';
import type { Game } from '../../shared/types';
import { trackDownload } from '../tracking';

export function setupInstallerHandlers(): void {
  ipcMain.handle(
    'install-translation',
    async (_, game: Game, platform: string, customGamePath?: string, createBackup?: boolean, installVoice?: boolean, installAchievements?: boolean) => {
      try {
        await installTranslation(
          game,
          platform,
          customGamePath,
          createBackup ?? true,
          installVoice ?? false,
          installAchievements ?? false,
          (downloadProgress) => {
            getMainWindow()?.webContents.send('download-progress', downloadProgress);
          },
          (status) => {
            getMainWindow()?.webContents.send('installation-status', status);
          }
        );

        // Note: cache invalidation та installed-games-changed event
        // автоматично відбуваються через InstallationWatcher при зміні файлів

        // Track successful download (non-blocking)
        trackDownload(game.id).catch(() => {
          // Помилки трекінгу вже логуються в tracking.ts
        });

        return { success: true };
      } catch (error) {
        console.error('Error installing translation:', error);
        // Return error info instead of throwing to preserve custom properties
        return {
          success: false,
          error: {
            message: error instanceof Error ? error.message : 'Невідома помилка',
            needsManualSelection: error instanceof ManualSelectionError,
          }
        };
      }
    }
  );

  ipcMain.handle('check-installation', async (_, game: Game) => {
    try {
      return await checkInstallation(game);
    } catch (error) {
      console.error('Error checking installation:', error);
      return null;
    }
  });

  ipcMain.handle('get-all-installed-game-ids', async () => {
    try {
      return await getAllInstalledGameIds();
    } catch (error) {
      console.error('Error getting installed game IDs:', error);
      return [];
    }
  });

  ipcMain.handle('open-external', async (_, url: string) => {
    await shell.openExternal(url);
  });

  ipcMain.handle('select-game-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Виберіть папку з грою',
      buttonLabel: 'Вибрати',
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle('uninstall-translation', async (_, game: Game) => {
    try {
      await uninstallTranslation(game);

      // Note: cache invalidation та installed-games-changed event
      // автоматично відбуваються через InstallationWatcher при зміні файлів

      return { success: true };
    } catch (error) {
      console.error('Error uninstalling translation:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  });

  ipcMain.handle('abort-download', async () => {
    try {
      abortCurrentDownload();
      return { success: true };
    } catch (error) {
      console.error('Error aborting download:', error);
      return { success: false };
    }
  });

  ipcMain.handle('remove-orphaned-metadata', async (_, gameIds: string[]) => {
    try {
      await removeOrphanedInstallationMetadata(gameIds);
      return { success: true };
    } catch (error) {
      console.error('Error removing orphaned metadata:', error);
      return { success: false };
    }
  });

  ipcMain.handle('remove-components', async (_, game: Game, componentsToRemove: { voice?: boolean; achievements?: boolean }) => {
    try {
      await removeComponents(game, componentsToRemove);
      return { success: true };
    } catch (error) {
      console.error('Error removing components:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Невідома помилка',
        },
      };
    }
  });
}
