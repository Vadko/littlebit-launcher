import React, { useEffect } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';
import { AmbientBackground } from './components/Layout/AmbientBackground';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MainContent } from './components/MainContent/MainContent';
import { useStore } from './store/useStore';

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
  const { fetchGames } = useStore();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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
    <div className="relative w-screen h-screen bg-bg-dark text-white">
      <AmbientBackground />

      {/* Title bar */}
      <div className="drag-region fixed top-0 left-0 right-0 h-8 flex items-center justify-between px-4 z-50">
        <div className="text-xs text-text-muted font-medium">Little Bit</div>
        <div className="no-drag flex gap-2">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-glass-hover transition-colors"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={handleMaximize}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-glass-hover transition-colors"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex h-full pt-8">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};
