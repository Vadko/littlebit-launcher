import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsStore {
  theme: ThemeMode;
  animationsEnabled: boolean;
  appUpdateNotificationsEnabled: boolean;
  gameUpdateNotificationsEnabled: boolean;
  createBackupBeforeInstall: boolean;
  autoDetectInstalledGames: boolean;
  showAdultGames: boolean;
  isSettingsModalOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleAnimations: () => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  toggleAppUpdateNotifications: () => void;
  setAppUpdateNotificationsEnabled: (enabled: boolean) => void;
  toggleGameUpdateNotifications: () => void;
  setGameUpdateNotificationsEnabled: (enabled: boolean) => void;
  toggleCreateBackup: () => void;
  setCreateBackupBeforeInstall: (enabled: boolean) => void;
  toggleAutoDetectInstalledGames: () => void;
  setAutoDetectInstalledGames: (enabled: boolean) => void;
  toggleShowAdultGames: () => void;
  setShowAdultGames: (enabled: boolean) => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      animationsEnabled: true,
      appUpdateNotificationsEnabled: true,
      gameUpdateNotificationsEnabled: true,
      createBackupBeforeInstall: true,
      autoDetectInstalledGames: true,
      showAdultGames: false,
      isSettingsModalOpen: false,

      setTheme: (theme) => set({ theme }),

      toggleAnimations: () =>
        set((state) => ({ animationsEnabled: !state.animationsEnabled })),

      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

      toggleAppUpdateNotifications: () =>
        set((state) => ({ appUpdateNotificationsEnabled: !state.appUpdateNotificationsEnabled })),

      setAppUpdateNotificationsEnabled: (enabled) => set({ appUpdateNotificationsEnabled: enabled }),

      toggleGameUpdateNotifications: () =>
        set((state) => ({ gameUpdateNotificationsEnabled: !state.gameUpdateNotificationsEnabled })),

      setGameUpdateNotificationsEnabled: (enabled) => set({ gameUpdateNotificationsEnabled: enabled }),

      toggleCreateBackup: () =>
        set((state) => ({ createBackupBeforeInstall: !state.createBackupBeforeInstall })),

      setCreateBackupBeforeInstall: (enabled) => set({ createBackupBeforeInstall: enabled }),

      toggleAutoDetectInstalledGames: () =>
        set((state) => ({ autoDetectInstalledGames: !state.autoDetectInstalledGames })),

      setAutoDetectInstalledGames: (enabled) => set({ autoDetectInstalledGames: enabled }),

      toggleShowAdultGames: () =>
        set((state) => ({ showAdultGames: !state.showAdultGames })),

      setShowAdultGames: (enabled) => set({ showAdultGames: enabled }),

      openSettingsModal: () => set({ isSettingsModalOpen: true }),

      closeSettingsModal: () => set({ isSettingsModalOpen: false }),
    }),
    {
      name: 'littlebit-settings',
    }
  )
);
