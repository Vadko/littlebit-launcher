import React from 'react';
import { Game } from '../../types/game';

interface GameHeroProps {
  game: Game;
}

export const GameHero: React.FC<GameHeroProps> = ({ game }) => {
  return (
    <div className="relative h-[300px] rounded-2xl overflow-hidden mb-6">
      {/* Background image */}
      <div className="absolute inset-0">
        {game.banner ? (
          <img
            src={game.banner}
            alt={game.nameUk}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent" />
      </div>

      {/* Game logo */}
      <div className="relative h-full flex items-end p-8">
        {game.logo ? (
          <img
            src={game.logo}
            alt={game.nameUk}
            className="max-h-32 max-w-md object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <h1 className="text-5xl font-head font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {game.nameUk}
          </h1>
        )}
      </div>
    </div>
  );
};
