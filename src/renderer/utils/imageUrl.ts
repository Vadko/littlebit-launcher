import { getImageUrl } from '../../lib/api';

/**
 * Get full URL for game images from Supabase Storage
 */
export function getGameImageUrl(imagePath: string | null): string | null {
  return getImageUrl(imagePath);
}
