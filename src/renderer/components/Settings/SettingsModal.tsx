import React from 'react';
import { Modal } from '../Modal/Modal';
import { Switch } from '../ui/Switch';
import { useSettingsStore } from '../../store/useSettingsStore';

const SettingItem = React.memo<{
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}>(({ id, title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-glass border border-border">
    <div className="flex-1 pr-4">
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-text-muted">{description}</p>
    </div>
    <Switch id={`switch-${id}`} checked={enabled} onCheckedChange={onChange} />
  </div>
));

SettingItem.displayName = 'SettingItem';

export const SettingsModal: React.FC = () => {
  const isSettingsModalOpen = useSettingsStore((state) => state.isSettingsModalOpen);
  const closeSettingsModal = useSettingsStore((state) => state.closeSettingsModal);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const animationsEnabled = useSettingsStore((state) => state.animationsEnabled);
  const toggleAnimations = useSettingsStore((state) => state.toggleAnimations);
  const appUpdateNotificationsEnabled = useSettingsStore((state) => state.appUpdateNotificationsEnabled);
  const toggleAppUpdateNotifications = useSettingsStore((state) => state.toggleAppUpdateNotifications);
  const gameUpdateNotificationsEnabled = useSettingsStore((state) => state.gameUpdateNotificationsEnabled);
  const toggleGameUpdateNotifications = useSettingsStore((state) => state.toggleGameUpdateNotifications);
  const createBackupBeforeInstall = useSettingsStore((state) => state.createBackupBeforeInstall);
  const toggleCreateBackup = useSettingsStore((state) => state.toggleCreateBackup);
  const autoDetectInstalledGames = useSettingsStore((state) => state.autoDetectInstalledGames);
  const toggleAutoDetectInstalledGames = useSettingsStore((state) => state.toggleAutoDetectInstalledGames);
  const showAdultGames = useSettingsStore((state) => state.showAdultGames);
  const toggleShowAdultGames = useSettingsStore((state) => state.toggleShowAdultGames);

  return (
    <Modal
      isOpen={isSettingsModalOpen}
      onClose={closeSettingsModal}
      title="Налаштування"
      footer={
        <button
          onClick={closeSettingsModal}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Закрити
        </button>
      }
    >
      <div className="space-y-4">
        {/* Theme selector */}
        <div className="p-4 rounded-xl bg-glass border border-border">
          <h4 className="text-sm font-semibold text-white mb-3">Тема</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'bg-glass border border-border text-text-muted hover:text-text-main hover:border-border-hover'
              }`}
            >
              Світла
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'bg-glass border border-border text-text-muted hover:text-text-main hover:border-border-hover'
              }`}
            >
              Темна
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'system'
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'bg-glass border border-border text-text-muted hover:text-text-main hover:border-border-hover'
              }`}
            >
              Системна
            </button>
          </div>
        </div>

        <SettingItem
          id="animations"
          title="Анімації"
          description="Увімкнути або вимкнути анімації в інтерфейсі"
          enabled={animationsEnabled}
          onChange={toggleAnimations}
        />
        <SettingItem
          id="app-updates"
          title="Сповіщення про оновлення додатку"
          description="Показувати сповіщення про нові версії додатку"
          enabled={appUpdateNotificationsEnabled}
          onChange={toggleAppUpdateNotifications}
        />
        <SettingItem
          id="game-updates"
          title="Сповіщення про оновлення ігор"
          description="Показувати сповіщення про нові версії перекладів"
          enabled={gameUpdateNotificationsEnabled}
          onChange={toggleGameUpdateNotifications}
        />
        <SettingItem
          id="backup"
          title="Створювати резервну копію"
          description="Зберігати оригінальні файли гри перед встановленням перекладу"
          enabled={createBackupBeforeInstall}
          onChange={toggleCreateBackup}
        />
        <SettingItem
          id="auto-detect"
          title="Автоматична перевірка встановлених ігор"
          description="Автоматично визначати встановлені ігри на вашому комп'ютері"
          enabled={autoDetectInstalledGames}
          onChange={toggleAutoDetectInstalledGames}
        />
        <SettingItem
          id="adult-games"
          title="Показувати 18+ ігри"
          description="Дозволити відображення ігор з контентом для дорослих"
          enabled={showAdultGames}
          onChange={toggleShowAdultGames}
        />
      </div>
    </Modal>
  );
};
