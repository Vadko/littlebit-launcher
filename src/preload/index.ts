import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI } from '../shared/types';

const electronAPI: ElectronAPI = {
  fetchGames: () => ipcRenderer.invoke('fetch-games'),
  installTranslation: (gameId: string, platform: string) =>
    ipcRenderer.invoke('install-translation', gameId, platform),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  selectGameFolder: () => ipcRenderer.invoke('select-game-folder'),
  onInstallProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('install-progress', (_, progress) => callback(progress));
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Window controls
contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
});
