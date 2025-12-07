import { useEffect } from 'react';
import type { Game } from '../types/game';
import { useStore } from '../store/useStore';

/**
 * Хук для підписки на real-time оновлення ігор
 * Оновлює selectedGame та перевіряє наявність оновлень для встановлених ігор
 * Підписка на Supabase керується автоматично в main process
 */
export function useRealtimeGames() {
  const { installedGames, checkForGameUpdate, markGameAsUpdated, isInitialLoad, selectedGame, setSelectedGame } = useStore();

  useEffect(() => {
    if (!window.electronAPI) return;

    // Обробник оновлень гри
    const handleGameUpdate = (updatedGame: Game) => {
      console.log('[useRealtimeGames] Game updated via real-time:', updatedGame.name);

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
    console.log('[useRealtimeGames] Subscribing to game updates');
    window.electronAPI.onGameUpdated(handleGameUpdate);
  }, [installedGames, checkForGameUpdate, markGameAsUpdated, isInitialLoad, selectedGame, setSelectedGame]);
}
