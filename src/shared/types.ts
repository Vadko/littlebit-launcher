export interface Game {
  id: string;
  name: string;
  nameUk: string;
  banner: string;
  logo: string;
  thumbnail: string;
  progress: {
    translation: number;
    editing: number;
    voicing: number;
  };
  platforms: ('steam' | 'gog' | 'epic')[];
  size: string;
  updated: string;
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

export interface ElectronAPI {
  fetchGames: () => Promise<Game[]>;
  installTranslation: (gameId: string, platform: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  onInstallProgress: (callback: (progress: number) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
