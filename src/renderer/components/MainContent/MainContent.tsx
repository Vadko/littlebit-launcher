import React from 'react';
import { Download, Heart, Gamepad2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { GameHero } from './GameHero';
import { StatusCard } from './StatusCard';
import { InfoCard } from './InfoCard';
import { Button } from '../ui/Button';

export const MainContent: React.FC = () => {
  const { selectedGame } = useStore();

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

      <div className="flex gap-4">
        <Button variant="primary" icon={<Download size={20} />}>
          Встановити переклад
        </Button>
        <Button variant="secondary" icon={<Heart size={20} />}>
          Підтримати проєкт
        </Button>
      </div>
    </div>
  );
};
