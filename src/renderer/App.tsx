import React, { useEffect, useState } from 'react';
import { AmbientBackground } from './components/Layout/AmbientBackground';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainContent } from './components/MainContent/MainContent';
import { UpdateNotification } from './components/UpdateNotification/UpdateNotification';
import { GameUpdateNotification } from './components/GameUpdateNotification/GameUpdateNotification';
import { GlobalModal } from './components/Modal/GlobalModal';
import { ConfirmModal } from './components/Modal/ConfirmModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { MinimizeIcon } from './components/Icons/MinimizeIcon';
import { MaximizeIcon } from './components/Icons/MaximizeIcon';
import { CloseIcon } from './components/Icons/CloseIcon';
import { useStore } from './store/useStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useRealtimeGames } from './hooks/useRealtimeGames';
import { useQueryClient } from '@tanstack/react-query';
import { GAMES_QUERY_KEY } from './hooks/useGamesQuery';

declare global {
  interface Window {
    windowControls?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export const App: React.FC = () => {
  const { setInitialLoadComplete, detectInstalledGames } = useStore();
  const { animationsEnabled, autoDetectInstalledGames } = useSettingsStore();
  const [online, setOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  // Підписка на real-time оновлення ігор
  useRealtimeGames();

  useEffect(() => {
    // Mark initial load as complete after 3 seconds to allow system notifications
    const timer = setTimeout(() => {
      setInitialLoadComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [setInitialLoadComplete]);

  // Детекція встановлених ігор на початку (якщо увімкнено)
  useEffect(() => {
    if (!autoDetectInstalledGames || !window.electronAPI) return;

    const runDetection = async () => {
      // Отримати всі ігри з кешу React Query
      const cachedData = queryClient.getQueryData<{ pages: { games: any[] }[] }>([GAMES_QUERY_KEY]);
      if (!cachedData) {
        console.log('[App] No cached data yet, skipping initial detection');
        return;
      }

      const allGames = cachedData.pages.flatMap(page => page.games);
      if (allGames.length > 0) {
        console.log('[App] Running initial game detection for', allGames.length, 'games');
        await detectInstalledGames(allGames);
      }
    };

    // Почекати трохи щоб перша сторінка встигла завантажитись
    const timer = setTimeout(runDetection, 1000);
    return () => clearTimeout(timer);
  }, [autoDetectInstalledGames, detectInstalledGames, queryClient]);

  // Слухати зміни Steam бібліотеки
  useEffect(() => {
    if (!autoDetectInstalledGames || !window.electronAPI) return;

    const handleSteamLibraryChange = async () => {
      console.log('[App] Steam library changed, re-running game detection');

      // Отримати всі ігри з кешу React Query
      const cachedData = queryClient.getQueryData<{ pages: { games: any[] }[] }>([GAMES_QUERY_KEY]);
      if (!cachedData) return;

      const allGames = cachedData.pages.flatMap(page => page.games);
      if (allGames.length > 0) {
        await detectInstalledGames(allGames);
      }
    };

    window.electronAPI.onSteamLibraryChanged?.(handleSteamLibraryChange);

    return () => {
      // Cleanup listener якщо потрібно
    };
  }, [autoDetectInstalledGames, detectInstalledGames, queryClient]);

  const handleOnlineEvent = () => {
    setOnline(true);
  };
  const handleOfflineEvent = () => {
    setOnline(false);
  };

  useEffect(() => {
    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  const handleMinimize = () => {
    window.windowControls?.minimize();
  };

  const handleMaximize = () => {
    window.windowControls?.maximize();
  };

  const handleClose = () => {
    window.windowControls?.close();
  };

  return (
    <div className={`relative w-screen h-screen bg-bg-dark text-white ${!animationsEnabled ? 'no-animations' : ''}`}>
      <AmbientBackground />

      {/* Title bar */}
      <div
        className={`drag-region fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-50 ${online ? '' : 'bg-red-500/20'} transition-colors`}
      >
        <div className="text-xs text-text-muted font-medium">LB</div>
        <div className="text-[10px] text-text-muted/50 absolute left-1/2 -translate-x-1/2">
          {`v${window.electronAPI?.getVersion?.() || ''}${online ? '' : ' · ви оффлайн'}`}
        </div>
        <div className="no-drag flex gap-2">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-glass-hover transition-colors"
          >
            <MinimizeIcon />
          </button>
          <button
            onClick={handleMaximize}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-glass-hover transition-colors"
          >
            <MaximizeIcon />
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex h-full pt-8 px-2 pb-2 gap-2">
        <Sidebar />
        <MainContent />
      </div>

      {/* Update notifications */}
      <UpdateNotification />
      <GameUpdateNotification />

      {/* Global modals */}
      <GlobalModal />
      <ConfirmModal />
      <SettingsModal />
    </div>
  );
};
