/**
 * Централізована конфігурація API для трекінгу
 */

export const API_BASE_URL = 'https://little-bit-tr.vercel.app';

export const API_ENDPOINTS = {
  DOWNLOADS_TRACK: `${API_BASE_URL}/api/downloads/track`,
  SUBSCRIPTIONS_TRACK: `${API_BASE_URL}/api/subscriptions/track`,
} as const;

export type TrackingAction = 'subscribe' | 'unsubscribe' | 'download';

export interface TrackingPayload {
  gameId: string;
  userIdentifier: string;
  action?: TrackingAction;
}

export interface TrackingResponse {
  success: boolean;
  downloads?: number;
  error?: string;
}
