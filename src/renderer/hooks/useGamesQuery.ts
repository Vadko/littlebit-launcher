import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { Game, GetGamesParams, GetGamesResult } from '../types/game';
import { useSettingsStore } from '../store/useSettingsStore';

export const GAMES_QUERY_KEY = 'games';

interface UseGamesQueryParams {
  filter: string;
  searchQuery: string;
  itemsPerPage: number;
}

/**
 * Хук для отримання ігор з пагінацією (infinite scroll)
 */
export function useGamesInfiniteQuery({ filter, searchQuery, itemsPerPage }: UseGamesQueryParams) {
  const showAdultGames = useSettingsStore((state) => state.showAdultGames);

  return useInfiniteQuery({
    queryKey: [GAMES_QUERY_KEY, { filter, searchQuery, showAdultGames }],
    // Offline-first: спробувати завантажити з мережі, але не failити якщо offline
    networkMode: 'offlineFirst',
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const params: GetGamesParams = {
        offset: pageParam,
        limit: itemsPerPage,
        searchQuery,
        filter,
        showAdultGames,
      };

      if (filter === 'installed-games') {
        // Спеціальна логіка для встановлених ігор
        const installedGameIds = [...new Set(await window.electronAPI.getAllInstalledGameIds())];
        console.log('[useGamesQuery] Found', installedGameIds.length, 'installed game IDs');

        if (installedGameIds.length === 0) {
          return { games: [], total: 0, hasMore: false };
        }

        // Отримати всі встановлені ігри один раз (вже відсортовані алфавітно)
        const installedGames = await window.electronAPI.fetchGamesByIds(installedGameIds);
        console.log('[useGamesQuery] Fetched', installedGames.length, 'installed games');

        // Застосувати пошук, якщо потрібно
        let filteredGames = installedGames;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredGames = installedGames.filter((game) =>
            game.name.toLowerCase().includes(query)
          );
        }

        // Клієнтська пагінація
        const total = filteredGames.length;
        const start = pageParam;
        const end = start + itemsPerPage;
        const paginatedGames = filteredGames.slice(start, end);
        const hasMore = end < total;

        return { games: paginatedGames, total, hasMore };
      }

      // Звичайна пагінація для інших фільтрів
      return await window.electronAPI.fetchGames(params);
    },
    getNextPageParam: (lastPage: GetGamesResult, allPages: GetGamesResult[]) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.reduce((total: number, page: GetGamesResult) => total + page.games.length, 0);
    },
    initialPageParam: 0,
  });
}

/**
 * Хук для отримання ігор за списком ID
 */
export function useGamesByIdsQuery(gameIds: string[], enabled = true) {
  return useQuery<Game[]>({
    queryKey: [GAMES_QUERY_KEY, 'by-ids', gameIds],
    queryFn: () => window.electronAPI.fetchGamesByIds(gameIds),
    enabled: enabled && gameIds.length > 0,
  });
}

/**
 * Хук для оновлення гри в кеші
 */
export function useUpdateGameInCache() {
  const queryClient = useQueryClient();

  return (updatedGame: Game) => {
    // Оновити всі запити ігор
    queryClient.setQueriesData<{ pages: GetGamesResult[] }>(
      { queryKey: [GAMES_QUERY_KEY], exact: false },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            games: page.games.map((game) =>
              game.id === updatedGame.id ? updatedGame : game
            ),
          })),
        };
      }
    );

    // Оновити query для конкретних ID
    queryClient.setQueriesData<Game[]>(
      { queryKey: [GAMES_QUERY_KEY, 'by-ids'], exact: false },
      (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((game) =>
          game.id === updatedGame.id ? updatedGame : game
        );
      }
    );
  };
}

