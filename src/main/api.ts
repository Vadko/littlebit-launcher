import { Game } from '../shared/types';
import { getApprovedGames } from '../lib/api';

export async function fetchGames(): Promise<Game[]> {
  try {
    console.log('[API] Fetching games from Supabase...');
    const games = await getApprovedGames();
    console.log(`[API] Fetched ${games.length} games from Supabase`);
    return games;
  } catch (error) {
    console.error('[API] Error fetching games from Supabase:', error);
    return [];
  }
}
