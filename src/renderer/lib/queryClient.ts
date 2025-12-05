import { QueryClient } from '@tanstack/react-query';

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
