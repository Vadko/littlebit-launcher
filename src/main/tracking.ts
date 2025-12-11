/**
 * Централізований модуль для трекінгу подій (завантаження, підписки)
 * Використовує machine ID для ідентифікації користувача
 */

import { machineIdSync } from 'node-machine-id';
import { API_ENDPOINTS, type TrackingResponse } from '../shared/api-config';

let cachedMachineId: string | null = null;

/**
 * Отримати machine ID (з кешуванням)
 */
export function getMachineId(): string | null {
  if (cachedMachineId) {
    return cachedMachineId;
  }

  try {
    cachedMachineId = machineIdSync();
    return cachedMachineId;
  } catch (error) {
    console.error('[Tracking] Error getting machine ID:', error);
    return null;
  }
}

/**
 * Трекінг завантаження гри
 */
export async function trackDownload(gameId: string): Promise<TrackingResponse> {
  const machineId = getMachineId();
  if (!machineId) {
    console.warn('[Tracking] Could not get machine ID, skipping download tracking');
    return { success: false, error: 'Machine ID not available' };
  }

  try {
    console.log('[Tracking] Tracking download for game:', gameId);

    const response = await fetch(API_ENDPOINTS.DOWNLOADS_TRACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId,
        userIdentifier: machineId,
      }),
    });

    const result = await response.json() as TrackingResponse;

    if (result.success) {
      console.log('[Tracking] Download tracked successfully. Total downloads:', result.downloads);
    } else {
      console.warn('[Tracking] Download tracking failed:', result.error);
    }

    return result;
  } catch (error) {
    console.error('[Tracking] Failed to track download:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Трекінг підписки на гру
 */
export async function trackSubscription(
  gameId: string,
  action: 'subscribe' | 'unsubscribe'
): Promise<TrackingResponse> {
  const machineId = getMachineId();
  if (!machineId) {
    console.warn('[Tracking] Could not get machine ID, skipping subscription tracking');
    return { success: false, error: 'Machine ID not available' };
  }

  try {
    console.log(`[Tracking] Tracking ${action} for game:`, gameId);

    const response = await fetch(API_ENDPOINTS.SUBSCRIPTIONS_TRACK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId,
        userIdentifier: machineId,
        action,
      }),
    });

    const result = await response.json() as TrackingResponse;
    console.log('[Tracking] Subscription tracking response:', result);

    return result;
  } catch (error) {
    console.error('[Tracking] Failed to track subscription:', error);
    return { success: false, error: String(error) };
  }
}
