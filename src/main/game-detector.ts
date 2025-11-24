import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface GamePath {
  platform: 'steam' | 'gog' | 'epic';
  path: string;
  exists: boolean;
}

/**
 * Detect Steam installation path
 */
function getSteamPath(): string | null {
  try {
    if (process.platform === 'win32') {
      // Windows: Read from registry
      try {
        const output = execSync(
          'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Valve\\Steam" /v InstallPath',
          { encoding: 'utf8' }
        );
        const match = output.match(/InstallPath\s+REG_SZ\s+(.+)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      } catch {
        // Try 32-bit registry path
        const output = execSync(
          'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Valve\\Steam" /v InstallPath',
          { encoding: 'utf8' }
        );
        const match = output.match(/InstallPath\s+REG_SZ\s+(.+)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } else if (process.platform === 'darwin') {
      // macOS
      const defaultPath = path.join(os.homedir(), 'Library/Application Support/Steam');
      if (fs.existsSync(defaultPath)) {
        return defaultPath;
      }
    } else if (process.platform === 'linux') {
      // Linux
      const defaultPath = path.join(os.homedir(), '.steam/steam');
      if (fs.existsSync(defaultPath)) {
        return defaultPath;
      }
      const flatpakPath = path.join(os.homedir(), '.var/app/com.valvesoftware.Steam/.steam/steam');
      if (fs.existsSync(flatpakPath)) {
        return flatpakPath;
      }
    }
  } catch (error) {
    console.error('Error detecting Steam path:', error);
  }
  return null;
}

/**
 * Parse Steam library folders
 */
function getSteamLibraryFolders(steamPath: string): string[] {
  const folders: string[] = [path.join(steamPath, 'steamapps')];

  try {
    const libraryFoldersPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');
    if (fs.existsSync(libraryFoldersPath)) {
      const content = fs.readFileSync(libraryFoldersPath, 'utf8');

      // Parse VDF format (simple regex approach)
      const pathMatches = content.matchAll(/"path"\s+"([^"]+)"/g);
      for (const match of pathMatches) {
        const libraryPath = match[1].replace(/\\\\/g, '\\');
        const steamappsPath = path.join(libraryPath, 'steamapps');
        if (fs.existsSync(steamappsPath)) {
          folders.push(steamappsPath);
        }
      }
    }
  } catch (error) {
    console.error('Error parsing Steam library folders:', error);
  }

  return folders;
}

/**
 * Find Steam game by folder name
 */
function findSteamGame(gameFolderName: string): string | null {
  const steamPath = getSteamPath();
  if (!steamPath) return null;

  const libraryFolders = getSteamLibraryFolders(steamPath);

  for (const folder of libraryFolders) {
    const commonPath = path.join(folder, 'common', gameFolderName);
    if (fs.existsSync(commonPath)) {
      return commonPath;
    }
  }

  return null;
}

/**
 * Detect GOG installation path
 */
function getGOGPath(): string | null {
  try {
    if (process.platform === 'win32') {
      try {
        const output = execSync(
          'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\GOG.com\\GalaxyClient\\paths" /v client',
          { encoding: 'utf8' }
        );
        const match = output.match(/client\s+REG_SZ\s+(.+)/);
        if (match && match[1]) {
          return path.dirname(match[1].trim());
        }
      } catch {
        // Fallback to default path
        const defaultPath = 'C:\\Program Files (x86)\\GOG Galaxy\\Games';
        if (fs.existsSync(defaultPath)) {
          return defaultPath;
        }
      }
    } else if (process.platform === 'darwin') {
      const defaultPath = '/Applications/GOG Galaxy.app';
      if (fs.existsSync(defaultPath)) {
        return path.join(os.homedir(), 'Applications/GOG Galaxy');
      }
    }
  } catch (error) {
    console.error('Error detecting GOG path:', error);
  }
  return null;
}

/**
 * Find GOG game by folder name
 */
function findGOGGame(gameFolderName: string): string | null {
  const gogPath = getGOGPath();
  if (!gogPath) return null;

  const gamePath = path.join(gogPath, gameFolderName);
  if (fs.existsSync(gamePath)) {
    return gamePath;
  }

  return null;
}

/**
 * Detect Epic Games installation path
 */
function getEpicPath(): string | null {
  try {
    if (process.platform === 'win32') {
      const defaultPath = 'C:\\Program Files\\Epic Games';
      if (fs.existsSync(defaultPath)) {
        return defaultPath;
      }
    } else if (process.platform === 'darwin') {
      // Epic Games on macOS
      const defaultPath = path.join(os.homedir(), 'Library/Application Support/Epic/EpicGamesLauncher');
      if (fs.existsSync(defaultPath)) {
        return '/Applications'; // Games are usually in Applications
      }
    }
  } catch (error) {
    console.error('Error detecting Epic path:', error);
  }
  return null;
}

/**
 * Find Epic game by folder name
 */
function findEpicGame(gameFolderName: string): string | null {
  const epicPath = getEpicPath();
  if (!epicPath) return null;

  const gamePath = path.join(epicPath, gameFolderName);
  if (fs.existsSync(gamePath)) {
    return gamePath;
  }

  return null;
}

/**
 * Detect all possible paths for a game
 */
export function detectGamePaths(installPaths: {
  steam?: string;
  gog?: string;
  epic?: string;
}): GamePath[] {
  const results: GamePath[] = [];

  // Check Steam
  if (installPaths.steam) {
    const steamPath = findSteamGame(installPaths.steam);
    results.push({
      platform: 'steam',
      path: steamPath || '',
      exists: !!steamPath,
    });
  }

  // Check GOG
  if (installPaths.gog) {
    const gogPath = findGOGGame(installPaths.gog);
    results.push({
      platform: 'gog',
      path: gogPath || '',
      exists: !!gogPath,
    });
  }

  // Check Epic
  if (installPaths.epic) {
    const epicPath = findEpicGame(installPaths.epic);
    results.push({
      platform: 'epic',
      path: epicPath || '',
      exists: !!epicPath,
    });
  }

  return results;
}

/**
 * Get the first available game path
 */
export function getFirstAvailableGamePath(installPaths: {
  steam?: string;
  gog?: string;
  epic?: string;
}): GamePath | null {
  const paths = detectGamePaths(installPaths);
  return paths.find(p => p.exists) || null;
}
