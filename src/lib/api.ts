import { supabase } from './supabase';
import type { Game } from '../shared/types';
import type { Database } from './database.types';

type GameStatus = Database['public']['Enums']['game_status'];

interface GetGamesParams {
  offset?: number;
  limit?: number;
  searchQuery?: string;
  filter?: string;
}

interface GetGamesResult {
  games: Game[];
  total: number;
  hasMore: boolean;
}

/**
 * Отримати список затверджених перекладів з пагінацією та пошуком
 */
export async function getApprovedGames(params: GetGamesParams = {}): Promise<GetGamesResult> {
  const { offset = 0, limit = 10, searchQuery = '', filter = 'all' } = params;

  let query = supabase
    .from('games')
    .select('*', { count: 'exact' })
    .eq('approved', true);

  // Apply filter by status
  if (filter !== 'all') {
    query = query.eq('status', filter as GameStatus);
  }

  // Apply search
  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  // Apply pagination and ordering
  query = query
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching games:', error);
    return { games: [], total: 0, hasMore: false };
  }

  const games = (data || []).map((game): Game => ({
    id: game.id,
    slug: game.slug,
    name: game.name,
    version: game.version,
    translation_progress: game.translation_progress,
    editing_progress: game.editing_progress,
    fonts_progress: game.fonts_progress,
    textures_progress: game.textures_progress,
    voice_progress: game.voice_progress,
    team: game.team,
    status: game.status,
    platforms: game.platforms,
    install_paths: game.install_paths || [],
    archive_path: game.archive_path || '',
    archive_hash: game.archive_hash,
    archive_size: game.archive_size,
    banner_path: game.banner_path,
    logo_path: game.logo_path,
    thumbnail_path: game.thumbnail_path,
    game_description: game.game_description,
    description: game.description,
    support_url: game.support_url,
    video_url: game.video_url,
    website: game.website,
    telegram: game.telegram,
    twitter: game.twitter,
    youtube: game.youtube,
    installation_file_windows_path: game.installation_file_windows_path,
    installation_file_linux_path: game.installation_file_linux_path,
  }));

  const total = count || 0;
  const hasMore = offset + limit < total;

  return { games, total, hasMore };
}

/**
 * Отримати ігри за списком ID (для встановлених ігор)
 */
export async function getGamesByIds(gameIds: string[]): Promise<Game[]> {
  if (gameIds.length === 0) return [];

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .in('id', gameIds)
    .eq('approved', true);

  if (error) {
    console.error('Error fetching games by IDs:', error);
    return [];
  }

  return (data || []).map((game): Game => ({
    id: game.id,
    slug: game.slug,
    name: game.name,
    version: game.version,
    translation_progress: game.translation_progress,
    editing_progress: game.editing_progress,
    fonts_progress: game.fonts_progress,
    textures_progress: game.textures_progress,
    voice_progress: game.voice_progress,
    team: game.team,
    status: game.status,
    platforms: game.platforms,
    install_paths: game.install_paths || [],
    archive_path: game.archive_path || '',
    archive_hash: game.archive_hash,
    archive_size: game.archive_size,
    banner_path: game.banner_path,
    logo_path: game.logo_path,
    thumbnail_path: game.thumbnail_path,
    game_description: game.game_description,
    description: game.description,
    support_url: game.support_url,
    video_url: game.video_url,
    website: game.website,
    telegram: game.telegram,
    twitter: game.twitter,
    youtube: game.youtube,
    installation_file_windows_path: game.installation_file_windows_path,
    installation_file_linux_path: game.installation_file_linux_path,
  }));
}

/**
 * Знайти ігри за списком install paths (для детектування встановлених ігор)
 * З підтримкою пагінації
 */
export async function findGamesByInstallPaths(
  installPaths: string[],
  offset: number = 0,
  limit: number = 10
): Promise<{ games: Game[]; total: number; hasMore: boolean }> {
  if (installPaths.length === 0) {
    return { games: [], total: 0, hasMore: false };
  }

  console.log(`[API] Searching for games with ${installPaths.length} install paths (offset: ${offset}, limit: ${limit})`);

  try {
    // Query ALL games where any install_path matches (we need to filter client-side)
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('approved', true)
      .not('install_paths', 'is', null);

    if (error) {
      console.error('[API] Error fetching games for install paths:', error);
      return { games: [], total: 0, hasMore: false };
    }

    if (!data || data.length === 0) {
      return { games: [], total: 0, hasMore: false };
    }

    // Filter games that match any of the install paths
    const matchedGames = data.filter((game) => {
      if (!game.install_paths || !Array.isArray(game.install_paths)) return false;

      return game.install_paths.some((installPath: any) => {
        if (!installPath || !installPath.path) return false;

        const dbPath = installPath.path.toLowerCase();

        // Check if any of the detected paths match
        return installPaths.some(detectedPath => {
          const detected = detectedPath.toLowerCase();
          return detected === dbPath ||
                 detected.endsWith(`/${dbPath}`) ||
                 detected.endsWith(`\\${dbPath}`) ||
                 dbPath.endsWith(`/${detected}`) ||
                 dbPath.endsWith(`\\${detected}`);
        });
      });
    });

    console.log(`[API] Found ${matchedGames.length} games matching installed paths`);

    // Apply pagination
    const total = matchedGames.length;
    const paginatedGames = matchedGames.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    console.log(`[API] Returning ${paginatedGames.length} games (page ${Math.floor(offset / limit) + 1})`);

    const games = paginatedGames.map((game): Game => ({
      id: game.id,
      slug: game.slug,
      name: game.name,
      version: game.version,
      translation_progress: game.translation_progress,
      editing_progress: game.editing_progress,
      fonts_progress: game.fonts_progress,
      textures_progress: game.textures_progress,
      voice_progress: game.voice_progress,
      team: game.team,
      status: game.status,
      platforms: game.platforms,
      install_paths: game.install_paths || [],
      archive_path: game.archive_path || '',
      archive_hash: game.archive_hash,
      archive_size: game.archive_size,
      banner_path: game.banner_path,
      logo_path: game.logo_path,
      thumbnail_path: game.thumbnail_path,
      game_description: game.game_description,
      description: game.description,
      support_url: game.support_url,
      video_url: game.video_url,
      website: game.website,
      telegram: game.telegram,
      twitter: game.twitter,
      youtube: game.youtube,
      installation_file_windows_path: game.installation_file_windows_path,
      installation_file_linux_path: game.installation_file_linux_path,
    }));

    return { games, total, hasMore };
  } catch (error) {
    console.error('[API] Exception in findGamesByInstallPaths:', error);
    return { games: [], total: 0, hasMore: false };
  }
}

/**
 * Отримати публічне URL для завантаження архіву
 */
export function getArchiveDownloadUrl(archivePath: string): string {
  const { data } = supabase.storage
    .from('game-archives')
    .getPublicUrl(archivePath);

  return data.publicUrl;
}

/**
 * Отримати URL зображення
 */
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  const { data } = supabase.storage
    .from('game-images')
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

/**
 * Перевірити оновлення конкретної гри
 */
export async function checkGameUpdate(currentGameId: string, currentVersion: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('games')
    .select('version')
    .eq('id', currentGameId)
    .eq('approved', true)
    .single();

  if (error || !data) return false;

  return data.version !== currentVersion;
}

/**
 * Підписатися на оновлення ігор (Real-time)
 */
export function subscribeToGameUpdates(callback: (game: Game) => void) {
  const channel = supabase
    .channel('game-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: 'approved=eq.true',
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as Game);
        }
      }
    )
    .subscribe((status, err) => {
      console.log('Channel subscription status:', status, err);
    });

  return () => channel.unsubscribe();
}
