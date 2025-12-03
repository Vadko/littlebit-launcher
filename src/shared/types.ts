import type { Database } from '../lib/database.types';

type GameStatus = Database['public']['Enums']['game_status'];

export type { Database };
export type InstallPath = Database['public']['CompositeTypes']['install_path_entry'];

export interface Game {
  id: string;
  slug: string;
  name: string;
  version: string | null;
  translation_progress: number;
  editing_progress: number;
  fonts_progress: number | null;
  textures_progress: number | null;
  voice_progress: number | null;
  team: string;
  status: GameStatus;
  platforms: string[];
  install_paths: InstallPath[];
  archive_path: string | null;
  archive_hash: string | null;
  archive_size: string | null;
  banner_path: string | null;
  logo_path: string | null;
  thumbnail_path: string | null;
  game_description: string | null;
  description: string | null;
  support_url: string | null;
  video_url: string | null;
  website: string | null;
  telegram: string | null;
  twitter: string | null;
  youtube: string | null;
  installation_file_windows_path: string | null;
  installation_file_linux_path: string | null;
}

export interface InstallationInfo {
  gameId: string;
  version: string;
  installedAt: string;
  gamePath: string;
  hasBackup?: boolean;
  installedFiles?: string[]; // Relative paths of all installed files
}

export interface DownloadProgress {
  percent: number;
  downloadedBytes: number;
  totalBytes: number;
  bytesPerSecond: number;
  timeRemaining: number; // in seconds
}

export interface InstallationStatus {
  message: string;
}

export interface InstallResult {
  success: boolean;
  error?: {
    message: string;
    needsManualSelection?: boolean;
  };
}

export interface GetGamesParams {
  offset?: number;
  limit?: number;
  searchQuery?: string;
  filter?: string;
}

export interface GetGamesResult {
  games: Game[];
  total: number;
  hasMore: boolean;
}

export interface DetectedGameInfo {
  platform: Database['public']['Enums']['install_source'];
  path: string;
  exists: boolean;
}

export interface LaunchGameResult {
  success: boolean;
  error?: string;
}

export interface ElectronAPI {
  fetchGames: (params?: GetGamesParams) => Promise<GetGamesResult>;
  fetchGamesByIds: (gameIds: string[]) => Promise<Game[]>;
  getAllInstalledGamePaths: () => Promise<string[]>;
  findGamesByInstallPaths: (installPaths: string[], offset?: number, limit?: number) => Promise<GetGamesResult>;
  installTranslation: (game: Game, platform: string, customGamePath?: string, createBackup?: boolean) => Promise<InstallResult>;
  uninstallTranslation: (game: Game) => Promise<InstallResult>;
  checkInstallation: (game: Game) => Promise<InstallationInfo | null>;
  getAllInstalledGameIds: () => Promise<string[]>;
  openExternal: (url: string) => Promise<void>;
  selectGameFolder: () => Promise<string | null>;
  onInstallProgress: (callback: (progress: number) => void) => void;
  onDownloadProgress: (callback: (progress: DownloadProgress) => void) => void;
  onInstallationStatus: (callback: (status: InstallationStatus) => void) => void;
  // Auto-updater
  checkForUpdates: () => Promise<{ available: boolean; updateInfo?: unknown; message?: string; error?: string }>;
  downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
  installUpdate: () => void;
  onUpdateAvailable: (callback: (info: unknown) => void) => void;
  onUpdateDownloaded: (callback: (info: unknown) => void) => void;
  onUpdateProgress: (callback: (progress: { percent?: number; bytesPerSecond?: number; total?: number; transferred?: number }) => void) => void;
  onUpdateError: (callback: (error: Error) => void) => void;
  // Real-time updates
  subscribeGameUpdates: () => Promise<{ success: boolean }>;
  unsubscribeGameUpdates: () => Promise<{ success: boolean }>;
  onGameUpdated: (callback: (game: Game) => void) => void;
  // Game update notifications
  showGameUpdateNotification?: (gameName: string, version: string, isInitialLoad: boolean) => void;
  // Game detection
  detectGame: (game: Game) => Promise<DetectedGameInfo | null>;
  detectGames: (games: Game[]) => Promise<Record<string, DetectedGameInfo>>;
  // Game launcher
  launchGame: (game: Game) => Promise<LaunchGameResult>;
  // Version
  getVersion: () => string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
