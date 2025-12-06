import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Game, GetGamesResult } from '../types/game';
import { GAMES_QUERY_KEY } from './useGamesQuery';
import { useStore } from '../store/useStore';

/**
 * Хук для підписки на real-time оновлення ігор
 * Оновлює кеш React Query коли приходять оновлення з Supabase
 */
export function useRealtimeGames() {
  const queryClient = useQueryClient();
  const { installedGames, checkForGameUpdate, markGameAsUpdated, isInitialLoad, selectedGame, setSelectedGame } = useStore();

  useEffect(() => {
    if (!window.electronAPI) return;

    console.log('[useRealtimeGames] Subscribing to game updates');

    // Підписатися на оновлення через Electron API
    window.electronAPI.subscribeGameUpdates();

    // Обробник оновлень гри
    const handleGameUpdate = (updatedGame: Game) => {
      console.log('[useRealtimeGames] Game updated via real-time:', updatedGame);

      // Оновити всі infinite query кеші
      queryClient.setQueriesData<{ pages: GetGamesResult[]; pageParams: unknown[] }>(
        { queryKey: [GAMES_QUERY_KEY], exact: false },
        (oldData) => {
          if (!oldData?.pages) return oldData;

          let gameFound = false;

          const updatedPages = oldData.pages.map((page) => {
            const gameIndex = page.games.findIndex((game) => game.id === updatedGame.id);

            if (gameIndex !== -1) {
              gameFound = true;
              // Оновити існуючу гру
              const updatedGames = [...page.games];
              updatedGames[gameIndex] = updatedGame;
              return { ...page, games: updatedGames };
            }

            return page;
          });

          // Якщо гра знайдена, просто оновити
          if (gameFound) {
            return { ...oldData, pages: updatedPages };
          }

          // Якщо гра не знайдена, додати її до першої сторінки (нова гра)
          if (updatedPages.length > 0) {
            const firstPage = { ...updatedPages[0] };
            firstPage.games = [updatedGame, ...firstPage.games].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            firstPage.total = (firstPage.total || 0) + 1;
            updatedPages[0] = firstPage;
          }

          return { ...oldData, pages: updatedPages };
        }
      );

      // Оновити query для конкретних ID (якщо такі є)
      queryClient.setQueriesData<Game[]>(
        { queryKey: [GAMES_QUERY_KEY, 'by-ids'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          const gameIndex = oldData.findIndex((game) => game.id === updatedGame.id);

          if (gameIndex !== -1) {
            const updated = [...oldData];
            updated[gameIndex] = updatedGame;
            return updated;
          }

          return oldData;
        }
      );

      // Оновити selectedGame якщо це та сама гра
      if (selectedGame && selectedGame.id === updatedGame.id) {
        console.log('[useRealtimeGames] Updating selectedGame in store');
        setSelectedGame(updatedGame);
      }

      // Перевірити наявність оновлення для встановленої гри
      const isInstalled = installedGames.has(updatedGame.id);

      if (isInstalled && updatedGame.version) {
        const hasUpdate = checkForGameUpdate(updatedGame.id, updatedGame.version);

        if (hasUpdate) {
          markGameAsUpdated(updatedGame.id);

          // Показати нотифікацію через Electron API
          window.electronAPI.showGameUpdateNotification?.(
            updatedGame.name,
            updatedGame.version,
            isInitialLoad
          );
        }
      }
    };

    // Підписатися на оновлення
    window.electronAPI.onGameUpdated(handleGameUpdate);

    // Cleanup: відписатися при демонтажі
    return () => {
      console.log('[useRealtimeGames] Unsubscribing from game updates');
      window.electronAPI.unsubscribeGameUpdates();
    };
  }, [queryClient, installedGames, checkForGameUpdate, markGameAsUpdated, isInitialLoad, selectedGame, setSelectedGame]);
}
