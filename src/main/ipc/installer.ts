import { ipcMain, dialog, shell } from 'electron';
import { installTranslation, checkInstallation, uninstallTranslation, getAllInstalledGameIds } from '../installer';
import { getMainWindow } from '../window';
import type { Game } from '../../shared/types';
import { machineIdSync } from 'node-machine-id';

export function setupInstallerHandlers(): void {
  ipcMain.handle(
    'install-translation',
    async (_, game: Game, platform: string, customGamePath?: string, createBackup?: boolean) => {
      try {
        await installTranslation(
          game,
          platform,
          customGamePath,
          createBackup,
          (downloadProgress) => {
            getMainWindow()?.webContents.send('download-progress', downloadProgress);
          },
          (status) => {
            getMainWindow()?.webContents.send('installation-status', status);
          }
        );

        // Track successful download
        try {
          const machineId = machineIdSync();
          const apiUrl = 'https://little-bit-tr.vercel.app/api/downloads/track';
          console.log('[Installer] Tracking download for game:', game.id);
          console.log('[Installer] Machine ID:', machineId);

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gameId: game.id,
              userIdentifier: machineId,
            }),
          });

          const result = await response.json();
          console.log('[Installer] Download tracking response:', result);

          if (result.success) {
            console.log('[Installer] Download tracked successfully. Total downloads:', result.downloads);
          } else {
            console.warn('[Installer] Download tracking failed:', result.error);
          }
        } catch (error) {
          // Не блокуємо встановлення якщо трекінг не вдався
          console.warn('[Installer] Failed to track download:', error);
        }

        return { success: true };
      } catch (error) {
        console.error('Error installing translation:', error);
        // Return error info instead of throwing to preserve custom properties
        return {
          success: false,
          error: {
            message: error instanceof Error ? error.message : 'Невідома помилка',
            needsManualSelection: error && typeof error === 'object' && 'needsManualSelection' in error
              ? (error as any).needsManualSelection
              : false,
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
      title: 'Оберіть папку з грою',
      buttonLabel: 'Обрати',
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  ipcMain.handle('uninstall-translation', async (_, game: Game) => {
    try {
      await uninstallTranslation(game);
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
      const { abortCurrentDownload } = await import('../installer');
      abortCurrentDownload();
      return { success: true };
    } catch (error) {
      console.error('Error aborting download:', error);
      return { success: false };
    }
  });
}
