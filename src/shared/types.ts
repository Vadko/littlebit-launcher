export interface Game {
  id: string;
  name: string;
  banner: string;
  logo: string;
  thumbnail: string;
  progress: {
    translation: number;
    editing: number;
  };
  platforms: ('steam' | 'gog' | 'epic')[];
  size: string;
  updated: string;
  version: string; // Version of the translation (e.g., "1.0.0", "2024-01-15")
  team: string;
  description: string;
  downloadUrl: string;
  installPaths: {
    steam?: string;
    gog?: string;
    epic?: string;
  };
  status: 'in-progress' | 'done' | 'early-access' | 'funded';
}

export interface InstallationInfo {
  gameId: string;
  version: string;
  installedAt: string;
  gamePath: string;
}

export interface ElectronAPI {
  fetchGames: () => Promise<Game[]>;
  installTranslation: (gameId: string, platform: string) => Promise<void>;
  checkInstallation: (gameId: string) => Promise<InstallationInfo | null>;
  openExternal: (url: string) => Promise<void>;
  selectGameFolder: () => Promise<string | null>;
  onInstallProgress: (callback: (progress: number) => void) => void;
  // Auto-updater
  checkForUpdates: () => Promise<{ available: boolean; updateInfo?: any; message?: string; error?: string }>;
  downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
  installUpdate: () => void;
  onUpdateAvailable: (callback: (info: any) => void) => void;
  onUpdateDownloaded: (callback: (info: any) => void) => void;
  onUpdateProgress: (callback: (progress: any) => void) => void;
  onUpdateError: (callback: (error: any) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
