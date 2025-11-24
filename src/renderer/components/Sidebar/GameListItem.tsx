import React from 'react';
import { Game } from '../../types/game';

interface GameListItemProps {
  game: Game;
  isSelected: boolean;
  onClick: () => void;
}

export const GameListItem: React.FC<GameListItemProps> = ({
  game,
  isSelected,
  onClick,
}) => {
  const averageProgress = Math.round(
    (game.progress.translation + game.progress.editing + game.progress.voicing) / 3
  );

  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-[rgba(0,242,255,0.1)] border border-[rgba(0,242,255,0.5)] shadow-[0_0_20px_rgba(0,242,255,0.2)]'
          : 'bg-glass border border-transparent hover:bg-glass-hover hover:border-border'
      }`}
    >
      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.nameUk}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm">
            {game.nameUk.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white mb-1 truncate">
          {game.nameUk}
        </h4>
        <div className="h-1 bg-glass-hover rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
