import React from 'react';
import { Settings, Bell } from 'lucide-react';

interface SidebarFooterProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  unreadCount: number;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = React.memo(
  ({ onOpenHistory, onOpenSettings, unreadCount }) => (
    <div className="flex gap-2 pt-3 border-t border-border p-4">
      <button
        onClick={onOpenHistory}
        className="relative flex-1 p-3 glass-button rounded-xl hover:bg-glass-hover transition-all duration-300"
        title="Сповіщення"
      >
        <Bell size={20} className="mx-auto text-text-muted" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] px-1 h-4 bg-neon-blue text-bg-dark text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <button
        onClick={onOpenSettings}
        className="flex-1 p-3 glass-button rounded-xl hover:bg-glass-hover transition-all duration-300"
        title="Налаштування"
      >
        <Settings size={20} className="mx-auto text-text-muted" />
      </button>
    </div>
  )
);
