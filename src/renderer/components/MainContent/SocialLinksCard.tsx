import React from 'react';
import { Game } from '../../types/game';
import { Globe, Send, Twitter, Youtube } from 'lucide-react';

interface SocialLinksCardProps {
  game: Game;
}

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  url: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, label, url }) => {
  const handleClick = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-glass hover:bg-glass-hover border border-border hover:border-border-hover transition-all duration-300"
      title={label}
    >
      <div className="text-neon-blue">{icon}</div>
      <span className="text-sm text-white font-medium">{label}</span>
    </button>
  );
};

export const SocialLinksCard: React.FC<SocialLinksCardProps> = ({ game }) => {
  const links = [
    game.website && { icon: <Globe size={18} />, label: 'Вебсайт', url: game.website },
    game.telegram && { icon: <Send size={18} />, label: 'Telegram', url: game.telegram },
    game.twitter && { icon: <Twitter size={18} />, label: 'Twitter', url: game.twitter },
    game.youtube && { icon: <Youtube size={18} />, label: 'YouTube', url: game.youtube },
  ].filter(Boolean) as SocialLinkProps[];

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="glass-card">
      <h3 className="text-lg font-head font-semibold text-white mb-4">
        Посилання
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <SocialLink key={index} {...link} />
        ))}
      </div>
    </div>
  );
};
