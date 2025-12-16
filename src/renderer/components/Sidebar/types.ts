import type { Database } from '../../../lib/database.types';
import type { Game } from '../../types/game';

export interface GameGroup {
  slug: string;
  name: string;
  translations: Game[];
}

export type FilterType =
  | 'all'
  | Database['public']['Enums']['game_status']
  | 'installed-translations'
  | 'installed-games';

interface FilterOption {
  label: string;
  value: FilterType;
  group?: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { label: 'Усі ігри', value: 'all' },
  { label: 'Заплановано', value: 'planned' },
  { label: 'Ранній доступ', value: 'in-progress' },
  { label: 'Готово', value: 'completed' },
  {
    label: 'Встановлені українізатори',
    value: 'installed-translations',
    group: 'installed',
  },
  { label: 'Встановлені ігри', value: 'installed-games', group: 'installed' },
];
