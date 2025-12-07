import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import type { Game } from '../../shared/types';
import { getMainWindow } from '../window';

/**
 * Supabase Realtime Manager для підписки на зміни в таблиці games
 */
export class SupabaseRealtimeManager {
  private channel: RealtimeChannel | null = null;
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    // Отримати credentials з env
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }
  }

  /**
   * Підписатися на realtime оновлення games
   */
  subscribe(onUpdate: (game: Game) => void, onDelete: (gameId: string) => void): void {
    if (this.channel) {
      console.log('[SupabaseRealtime] Already subscribed, skipping');
      return;
    }

    console.log('[SupabaseRealtime] Subscribing to games table changes...');

    const supabase = createClient(this.supabaseUrl, this.supabaseKey);

    this.channel = supabase
      .channel('games-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games'
        },
        (payload) => {
          console.log('[SupabaseRealtime] Game updated:', payload);
          const updatedGame = payload.new as Game;

          // Якщо гра більше не approved, видалити з локальної БД
          if (!updatedGame.approved) {
            console.log('[SupabaseRealtime] Game unapproved, removing from local DB:', updatedGame.name);
            onDelete(updatedGame.id);

            // Відправити game-removed в renderer
            const mainWindow = getMainWindow();
            if (mainWindow) {
              mainWindow.webContents.send('game-removed', updatedGame.id);
            }
            return;
          }

          // Оновити локальну БД через callback
          onUpdate(updatedGame);

          // Відправити оновлення в renderer process
          const mainWindow = getMainWindow();
          if (mainWindow) {
            // Відправити game-updated для оновлення конкретної гри
            mainWindow.webContents.send('game-updated', updatedGame);

            console.log('[SupabaseRealtime] Sent update to renderer:', updatedGame.name);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'games'
        },
        (payload) => {
          console.log('[SupabaseRealtime] Game deleted:', payload);
          const deletedGameId = payload.old.id as string;

          // Видалити з локальної БД
          onDelete(deletedGameId);

          // Відправити game-removed в renderer
          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send('game-removed', deletedGameId);
            console.log('[SupabaseRealtime] Sent game-removed to renderer:', deletedGameId);
          }
        }
      )
      .subscribe((status) => {
        console.log('[SupabaseRealtime] Subscription status:', status);
      });
  }

  /**
   * Відписатися від realtime оновлень
   */
  unsubscribe(): void {
    if (!this.channel) {
      console.log('[SupabaseRealtime] No active subscription');
      return;
    }

    console.log('[SupabaseRealtime] Unsubscribing from games table changes...');
    this.channel.unsubscribe();
    this.channel = null;
  }

  /**
   * Чи активна підписка
   */
  get isSubscribed(): boolean {
    return this.channel !== null;
  }
}