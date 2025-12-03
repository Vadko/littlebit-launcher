import { Game, GetGamesParams, GetGamesResult } from '../shared/types';
import { getApprovedGames, getGamesByIds, findGamesByInstallPaths as apiFindGamesByInstallPaths } from '../lib/api';

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

export async function findGamesByInstallPaths(
  installPaths: string[],
  offset: number = 0,
  limit: number = 10
): Promise<GetGamesResult> {
  try {
    console.log('[API] Finding games by install paths:', installPaths.length, 'paths', `(offset: ${offset}, limit: ${limit})`);
    const result = await apiFindGamesByInstallPaths(installPaths, offset, limit);
    console.log(`[API] Found ${result.games.length} games matching install paths, total: ${result.total}`);
    return result;
  } catch (error) {
    console.error('[API] Error finding games by install paths:', error);
    return { games: [], total: 0, hasMore: false };
  }
}
