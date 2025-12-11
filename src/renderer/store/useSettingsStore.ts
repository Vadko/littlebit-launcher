import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

// Debug mode can be enabled via env variable at build time
const isDebugModeEnabled = import.meta.env.VITE_DEBUG_MODE === 'true';

interface SettingsStore {
  theme: ThemeMode;
  animationsEnabled: boolean;
  appUpdateNotificationsEnabled: boolean;
  gameUpdateNotificationsEnabled: boolean;
  statusChangeNotificationsEnabled: boolean;
  createBackupBeforeInstall: boolean;
  autoDetectInstalledGames: boolean;
  showAdultGames: boolean;
  liquidGlassEnabled: boolean;
  isSettingsModalOpen: boolean;
  // Debug settings (only visible in debug mode)
  saveLogsToFile: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleAnimations: () => void;
  toggleAppUpdateNotifications: () => void;
  toggleGameUpdateNotifications: () => void;
  toggleStatusChangeNotifications: () => void;
  toggleCreateBackup: () => void;
  toggleAutoDetectInstalledGames: () => void;
  toggleShowAdultGames: () => void;
  toggleLiquidGlass: () => void;
  toggleSaveLogsToFile: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  isDebugMode: () => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      animationsEnabled: true,
      appUpdateNotificationsEnabled: true,
      gameUpdateNotificationsEnabled: true,
      statusChangeNotificationsEnabled: true,
      createBackupBeforeInstall: true,
      autoDetectInstalledGames: true,
      showAdultGames: false,
      liquidGlassEnabled: true,
      isSettingsModalOpen: false,
      // Debug settings
      saveLogsToFile: false,

      setTheme: (theme) => set({ theme }),

      toggleAnimations: () =>
        set((state) => ({ animationsEnabled: !state.animationsEnabled })),

      toggleAppUpdateNotifications: () =>
        set((state) => ({ appUpdateNotificationsEnabled: !state.appUpdateNotificationsEnabled })),

      toggleGameUpdateNotifications: () =>
        set((state) => ({ gameUpdateNotificationsEnabled: !state.gameUpdateNotificationsEnabled })),

      toggleStatusChangeNotifications: () =>
        set((state) => ({ statusChangeNotificationsEnabled: !state.statusChangeNotificationsEnabled })),

      toggleCreateBackup: () =>
        set((state) => ({ createBackupBeforeInstall: !state.createBackupBeforeInstall })),

      toggleAutoDetectInstalledGames: () =>
        set((state) => ({ autoDetectInstalledGames: !state.autoDetectInstalledGames })),

      toggleShowAdultGames: () =>
        set((state) => ({ showAdultGames: !state.showAdultGames })),

      toggleLiquidGlass: () =>
        set((state) => ({ liquidGlassEnabled: !state.liquidGlassEnabled })),

      toggleSaveLogsToFile: () =>
        set((state) => ({ saveLogsToFile: !state.saveLogsToFile })),

      openSettingsModal: () => set({ isSettingsModalOpen: true }),

      closeSettingsModal: () => set({ isSettingsModalOpen: false }),

      isDebugMode: () => isDebugModeEnabled,
    }),
    {
      name: 'littlebit-settings',
    }
  )
);
