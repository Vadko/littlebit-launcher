import React from 'react';
import { Settings, User } from 'lucide-react';
import { GlassPanel } from '../Layout/GlassPanel';
import { SearchBar } from './SearchBar';
import { GameListItem } from './GameListItem';
import { useStore, useFilteredGames } from '../../store/useStore';

type FilterType = 'all' | 'in-progress' | 'done' | 'early-access';

export const Sidebar: React.FC = () => {
  const { selectedGame, filter, searchQuery, setSelectedGame, setFilter, setSearchQuery } =
    useStore();
  const filteredGames = useFilteredGames();

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Усі', value: 'all' },
    { label: 'В процесі', value: 'in-progress' },
    { label: 'Завершено', value: 'done' },
    { label: 'Ранній доступ', value: 'early-access' },
  ];

  return (
    <GlassPanel className="w-[280px] h-screen flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
          <span className="text-white font-bold text-lg">LB</span>
        </div>
        <div>
          <h1 className="text-lg font-head font-bold text-white">Little Bit</h1>
          <p className="text-xs text-text-muted">Українські переклади</p>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
              filter === f.value
                ? 'bg-glass-hover text-white border border-border-hover'
                : 'bg-glass text-text-muted border border-transparent hover:bg-glass-hover hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Games list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredGames.length === 0 ? (
          <div className="text-center text-text-muted py-8">
            <p>Ігор не знайдено</p>
          </div>
        ) : (
          filteredGames.map((game) => (
            <GameListItem
              key={game.id}
              game={game}
              isSelected={selectedGame?.id === game.id}
              onClick={() => setSelectedGame(game)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          className="flex-1 p-3 glass-button rounded-xl hover:bg-glass-hover transition-all duration-300"
          title="Налаштування"
        >
          <Settings size={20} className="mx-auto text-text-muted" />
        </button>
        <button
          className="flex-1 p-3 glass-button rounded-xl hover:bg-glass-hover transition-all duration-300"
          title="Профіль"
        >
          <User size={20} className="mx-auto text-text-muted" />
        </button>
      </div>
    </GlassPanel>
  );
};
