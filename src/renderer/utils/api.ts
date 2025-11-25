import { Game } from '../types/game';

export async function fetchGames(): Promise<Game[]> {
  try {
    // Use Electron API to fetch from Supabase
    if (window.electronAPI) {
      return await window.electronAPI.fetchGames();
    }

    // In web context (shouldn't happen in Electron app)
    console.error('electronAPI not available');
    return [];
  } catch (error) {
    console.error('Error fetching games:', error);
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
