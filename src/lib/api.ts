import { supabase } from './supabase';

/**
 * Отримати публічне URL для завантаження архіву
 */
export function getArchiveDownloadUrl(archivePath: string): string {
  const { data } = supabase.storage
    .from('game-archives')
    .getPublicUrl(archivePath);

  return data.publicUrl;
}

/**
 * Отримати URL зображення
 */
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  const { data } = supabase.storage
    .from('game-images')
    .getPublicUrl(imagePath);

  return data.publicUrl;
}
