import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createElectronPersister } from './queryPersister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Дані не застарівають автоматично, оскільки синхронізуються в реалтаймі
      staleTime: Infinity,
      // Не рефетчити при фокусуванні вікна (реалтайм оновлення вже синхронізують дані)
      refetchOnWindowFocus: false,
      // Не рефетчити при реконекті (реалтайм оновлення вже синхронізують дані)
      refetchOnReconnect: false,
      // Не ретраїти автоматично
      retry: false,
      // Зберігати дані в кеші навіть коли немає підписників
      gcTime: Infinity,
    },
  },
});

// Налаштувати персистентність кешу
if (window.electronAPI) {
  persistQueryClient({
    queryClient,
    persister: createElectronPersister(),
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 днів
    buster: '', // Можна використати version для інвалідації старого кешу
  });
  console.log('[QueryClient] Persistence enabled');
}
