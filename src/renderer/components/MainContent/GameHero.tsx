import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Game } from '../../types/game';
import { getGameImageUrl } from '../../utils/imageUrl';

interface GameHeroProps {
  game: Game;
}

export const GameHero: React.FC<GameHeroProps> = ({ game }) => {
  const bannerUrl = getGameImageUrl(game.banner_path);
  const logoUrl = getGameImageUrl(game.logo_path);

  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Reset error state when game changes
  useEffect(() => {
    setBannerError(false);
    setLogoError(false);
  }, [game.id]);

  const showBanner = bannerUrl && !bannerError;
  const showLogo = logoUrl && !logoError;

  return (
    <div className="relative h-[300px] rounded-2xl overflow-hidden mb-6 select-none">
      {/* Banner placeholder - always visible behind */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink opacity-30" />

      {/* Banner image */}
      <AnimatePresence mode="wait">
        {showBanner && (
          <motion.div
            key={game.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <LazyLoadImage
              src={bannerUrl}
              alt={game.name}
              effect="blur"
              wrapperClassName="w-full h-full"
              className="w-full h-full rounded-2xl object-cover"
              draggable={false}
              onError={() => setBannerError(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent" />

      {/* Game logo */}
      <div className="relative h-full flex items-end p-8">
        <AnimatePresence mode="wait">
          {showLogo ? (
            <motion.div
              key={`logo-${game.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.35,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <LazyLoadImage
                src={logoUrl}
                alt={game.name}
                effect="blur"
                className="max-h-32 max-w-md object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                draggable={false}
                onError={() => setLogoError(true)}
              />
            </motion.div>
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
