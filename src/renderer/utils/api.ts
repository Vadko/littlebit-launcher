import { Game } from '../types/game';
import { GAMES_JSON_URL } from '../../shared/constants';

export async function fetchGames(): Promise<Game[]> {
  try {
    // Try to fetch from Electron API first
    if (window.electronAPI) {
      return await window.electronAPI.fetchGames();
    }

    // Fallback to direct GitHub fetch
    const response = await fetch(GAMES_JSON_URL);

    if (!response.ok) {
      // If GitHub fails, try local fallback
      const localResponse = await fetch('/translations/games.json');
      if (localResponse.ok) {
        const localData = await localResponse.json();
        return localData.games || [];
      }
      throw new Error('Failed to fetch games list');
    }

    const data = await response.json();
    return data.games || [];
  } catch (error) {
    console.error('Error fetching games:', error);
    // Return empty array or throw based on your error handling strategy
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
