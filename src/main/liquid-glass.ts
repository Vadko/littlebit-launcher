import { BrowserWindow } from 'electron';
import { supportsMacOSLiquidGlass, shouldEnableLiquidGlass } from './utils/platform';

// Lazy load the liquid glass module only when needed
let liquidGlass: any = null;

/**
 * Initialize liquid glass for a window
 * @param window The BrowserWindow to apply liquid glass to
 * @param userPreference Whether the user has enabled liquid glass in settings
 * @returns The glass ID if successful, null otherwise
 */
export async function applyLiquidGlass(
  window: BrowserWindow,
  userPreference: boolean = true
): Promise<string | null> {
  try {
    // Check if we should enable liquid glass
    if (!shouldEnableLiquidGlass(userPreference)) {
      console.log('[LiquidGlass] Not applying - either not supported or disabled by user');
      return null;
    }

    // Lazy load the liquid glass module
    if (!liquidGlass) {
      try {
        liquidGlass = await import('electron-liquid-glass');
      } catch (error) {
        console.warn('[LiquidGlass] Failed to load electron-liquid-glass module:', error);
        return null;
      }
    }

    // Get the native window handle
    const handle = window.getNativeWindowHandle();
    if (!handle) {
      console.warn('[LiquidGlass] Could not get native window handle');
      return null;
    }

    // Apply liquid glass effect
    const glassId = liquidGlass.default.addView(handle, {
      cornerRadius: 16,
      tintColor: '#050b1410', // Semi-transparent dark tint matching our theme
    });

    console.log('[LiquidGlass] Successfully applied liquid glass effect, ID:', glassId);
    return glassId;
  } catch (error) {
    console.error('[LiquidGlass] Error applying liquid glass:', error);
    return null;
  }
}

/**
 * Remove liquid glass effect from a window
 * @param glassId The glass ID returned from applyLiquidGlass
 */
export async function removeLiquidGlass(glassId: string): Promise<void> {
  try {
    if (!liquidGlass || !glassId) return;

    liquidGlass.default.removeView(glassId);
    console.log('[LiquidGlass] Removed liquid glass effect, ID:', glassId);
  } catch (error) {
    console.error('[LiquidGlass] Error removing liquid glass:', error);
  }
}

/**
 * Check if liquid glass is supported on the current system
 */
export function isLiquidGlassSupported(): boolean {
  return supportsMacOSLiquidGlass();
}