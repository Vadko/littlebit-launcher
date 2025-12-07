import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '../../types/game';
import { getGameImageUrl } from '../../utils/imageUrl';

interface GameHeroProps {
  game: Game;
}

export const GameHero: React.FC<GameHeroProps> = ({ game }) => {
  const bannerUrl = getGameImageUrl(game.banner_path);
  const logoUrl = getGameImageUrl(game.logo_path);

  return (
    <div className="relative h-[300px] rounded-2xl overflow-hidden mb-6 select-none">
      {/* Background image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backgroundClip: 'content-box',
          padding: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {bannerUrl ? (
            <motion.img
              key={`banner-${game.id}`}
              src={bannerUrl}
              alt={game.name}
              className="w-full h-full rounded-2xl object-cover"
              draggable={false}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ) : (
            <motion.div
              key={`gradient-${game.id}`}
              className="w-full h-full bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent" />
      </div>

      {/* Game logo */}
      <div className="relative h-full flex items-end p-8">
        <AnimatePresence mode="wait">
          {logoUrl ? (
            <motion.img
              key={`logo-${game.id}`}
              src={logoUrl}
              alt={game.name}
              className="max-h-32 max-w-md object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              draggable={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.35,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ) : (
            <motion.h1
              key={`title-${game.id}`}
              className="text-5xl font-head font-bold text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.35,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {game.name}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
