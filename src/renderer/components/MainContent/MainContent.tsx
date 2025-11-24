import React, { useState } from 'react';
import { Download, Heart, Gamepad2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GameHero } from './GameHero';
import { StatusCard } from './StatusCard';
import { InfoCard } from './InfoCard';
import { Button } from '../ui/Button';

export const MainContent: React.FC = () => {
  const { selectedGame } = useStore();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  const handleInstall = async () => {
    if (!selectedGame || isInstalling) return;

    // Check if Electron API is available
    if (!window.electronAPI) {
      alert('⚠️ Встановлення доступне тільки в десктопній версії додатку');
      return;
    }

    try {
      setIsInstalling(true);
      setInstallProgress(0);

      // Setup progress listener
      window.electronAPI.onInstallProgress?.((progress: number) => {
        setInstallProgress(progress);
      });

      // Get the first available platform
      const platform = selectedGame.platforms[0] || 'steam';

      // Start installation
      await window.electronAPI.installTranslation(selectedGame.id, platform);

      alert(`✅ Переклад ${selectedGame.nameUk} успішно встановлено!`);
      setInstallProgress(100);
    } catch (error) {
      console.error('Installation error:', error);
      alert(`❌ Помилка встановлення: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
    } finally {
      setIsInstalling(false);
      setInstallProgress(0);
    }
  };

  const handleSupport = () => {
    // Open support link
    const supportUrl = 'https://github.com/LittleBitUA';
    if (window.electronAPI) {
      window.electronAPI.openExternal(supportUrl);
    } else {
      window.open(supportUrl, '_blank');
    }
  };

  if (!selectedGame) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <Gamepad2 size={64} className="text-text-muted mb-4 opacity-50" />
        <h2 className="text-2xl font-head font-semibold text-white mb-2">
          Оберіть гру зі списку
        </h2>
        <p className="text-text-muted max-w-md">
          Виберіть гру, щоб побачити деталі та встановити переклад
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      <GameHero game={selectedGame} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <StatusCard game={selectedGame} />
        <InfoCard game={selectedGame} />
      </div>

      <div className="glass-card mb-6">
        <h3 className="text-lg font-head font-semibold text-white mb-3">
          Про переклад
        </h3>
        <p className="text-text-muted leading-relaxed">{selectedGame.description}</p>
      </div>

      <div className="space-y-4">
        {isInstalling && (
          <div className="glass-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Встановлення перекладу...</span>
              <span className="text-sm font-bold text-neon-blue">{Math.round(installProgress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-neon-blue to-neon-purple"
                style={{
                  width: `${installProgress}%`,
                  boxShadow: '0 0 10px rgba(0, 242, 255, 0.5)',
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="primary"
            icon={<Download size={20} />}
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? 'Встановлення...' : 'Встановити переклад'}
          </Button>
          <Button
            variant="secondary"
            icon={<Heart size={20} />}
            onClick={handleSupport}
          >
            Підтримати проєкт
          </Button>
        </div>
      </div>
    </div>
  );
};
