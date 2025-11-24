import { create } from 'zustand';
import { Game } from '../types/game';
import { fetchGames } from '../utils/api';

type FilterType = 'all' | 'in-progress' | 'done' | 'early-access';

interface Store {
  games: Game[];
  selectedGame: Game | null;
  filter: FilterType;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGames: () => Promise<void>;
  setSelectedGame: (game: Game | null) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  games: [],
  selectedGame: null,
  filter: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  fetchGames: async () => {
    set({ isLoading: true, error: null });
    try {
      const games = await fetchGames();
      set({ games, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoading: false,
      });
    }
  },

  setSelectedGame: (game) => set({ selectedGame: game }),
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

// Selector for filtered games
export const useFilteredGames = () => {
  const { games, filter, searchQuery } = useStore();

  return games.filter((game) => {
    // Filter by status
    if (filter !== 'all' && game.status !== filter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        game.name.toLowerCase().includes(query) ||
        game.nameUk.toLowerCase().includes(query)
      );
    }

    return true;
  });
};
