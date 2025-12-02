import { Game, GetGamesParams, GetGamesResult } from '../shared/types';
import { getApprovedGames, getGamesByIds } from '../lib/api';

export async function fetchGames(params: GetGamesParams = {}): Promise<GetGamesResult> {
  try {
    console.log('[API] Fetching games from Supabase with params:', params);
    const result = await getApprovedGames(params);
    console.log(`[API] Fetched ${result.games.length} games, total: ${result.total}, hasMore: ${result.hasMore}`);
    return result;
  } catch (error) {
    console.error('[API] Error fetching games from Supabase:', error);
    return { games: [], total: 0, hasMore: false };
  }
}

export async function fetchGamesByIds(gameIds: string[]): Promise<Game[]> {
  try {
    console.log('[API] Fetching games by IDs:', gameIds);
    const games = await getGamesByIds(gameIds);
    console.log(`[API] Fetched ${games.length} games by IDs`);
    return games;
  } catch (error) {
    console.error('[API] Error fetching games by IDs:', error);
    return [];
  }
}
