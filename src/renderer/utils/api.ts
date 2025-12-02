import { Game, GetGamesParams, GetGamesResult } from '../types/game';

export async function fetchGames(params?: GetGamesParams): Promise<GetGamesResult> {
  try {
    // Use Electron API to fetch from Supabase
    if (window.electronAPI) {
      return await window.electronAPI.fetchGames(params);
    }

    // In web context (shouldn't happen in Electron app)
    console.error('electronAPI not available');
    return { games: [], total: 0, hasMore: false };
  } catch (error) {
    console.error('Error fetching games:', error);
    return { games: [], total: 0, hasMore: false };
  }
}

export async function fetchGamesByIds(gameIds: string[]): Promise<Game[]> {
  try {
    if (window.electronAPI) {
      return await window.electronAPI.fetchGamesByIds(gameIds);
    }

    console.error('electronAPI not available');
    return [];
  } catch (error) {
    console.error('Error fetching games by IDs:', error);
    return [];
  }
}

export async function getAllInstalledGameIds(): Promise<string[]> {
  try {
    if (window.electronAPI) {
      return await window.electronAPI.getAllInstalledGameIds();
    }

    console.error('electronAPI not available');
    return [];
  } catch (error) {
    console.error('Error getting installed game IDs:', error);
    return [];
  }
}

export async function openExternalLink(url: string): Promise<void> {
  if (window.electronAPI) {
    await window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}
