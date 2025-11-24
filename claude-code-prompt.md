# 🎮 Промпт для Claude Code: Little Bit

**Назва додатку:** Little Bit  
**Опис:** Десктопний інсталятор українських перекладів відеоігор

Створи десктопний додаток на Electron для інсталятора українських перекладів відеоігор з **темним glassmorphism дизайном** як на сайті https://littlebitua.github.io/

---

## 🎨 ДИЗАЙН (Dark Glassmorphism + Neon Accents)

### Колірна палітра:
```css
:root {
  /* Основні кольори */
  --bg-dark: #050b14;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-hover: rgba(255, 255, 255, 0.1);
  --border: rgba(255, 255, 255, 0.1);
  --border-hover: rgba(255, 255, 255, 0.3);

  /* Neon акценти */
  --neon-blue: #00f2ff;
  --neon-purple: #bd00ff;
  --neon-pink: #ff0055;
  --neon-orange: #ff9e00;
  --neon-green: #10b981;

  /* Текст */
  --text-main: #ffffff;
  --text-muted: #94a3b8;

  /* Шрифти */
  --font-head: 'Space Grotesk', 'Segoe UI', sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
}
```

### Glassmorphism ефекти:
```css
/* Базовий glass компонент */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

/* Glass кнопка */
.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2);
}
```

### Animated Background (Floating Blobs):
```css
/* Анімовані плями на фоні */
.ambient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite alternate;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, #bd00ff, transparent);
}

.blob-2 {
  bottom: -10%;
  right: -10%;
  width: 70vw;
  height: 70vw;
  background: radial-gradient(circle, #00f2ff, transparent);
  animation-delay: -5s;
}

.blob-3 {
  top: 40%;
  left: 20%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, #ff0055, transparent);
  opacity: 0.3;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(30px, 20px) rotate(5deg); }
}

/* Noise overlay */
.noise-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,..."); /* SVG noise texture */
  mix-blend-mode: overlay;
  opacity: 0.6;
  pointer-events: none;
}
```

---

## 📐 СТРУКТУРА ІНТЕРФЕЙСУ

### 1. Ліва панель (Sidebar) - 280px:
```tsx
<div className="sidebar glass-panel">
  {/* Header з логотипом */}
  <div className="sidebar-header">
    <div className="logo-section">
      <img src="logo.png" alt="Little Bit" />
      <h1>«Little Bit»</h1>
    </div>
  </div>

  {/* Пошук */}
  <div className="search-section">
    <div className="glass-search">
      <SearchIcon />
      <input type="text" placeholder="Пошук гри..." />
    </div>
  </div>

  {/* Фільтри */}
  <div className="filters">
    <button className="filter-btn active">Усі</button>
    <button className="filter-btn">В процесі</button>
    <button className="filter-btn">Завершено</button>
    <button className="filter-btn">Ранній доступ</button>
  </div>

  {/* Список ігор */}
  <div className="games-list">
    {games.map(game => (
      <GameListItem
        key={game.id}
        game={game}
        isSelected={selectedGame?.id === game.id}
        onClick={() => setSelectedGame(game)}
      />
    ))}
  </div>

  {/* Footer з налаштуваннями */}
  <div className="sidebar-footer">
    <button className="icon-btn" title="Налаштування">
      <SettingsIcon />
    </button>
    <button className="icon-btn" title="Профіль">
      <UserIcon />
    </button>
  </div>
</div>
```

**Стиль GameListItem:**
```css
.game-list-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-list-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.game-list-item.selected {
  background: rgba(0, 242, 255, 0.1);
  border-color: rgba(0, 242, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 242, 255, 0.2);
}

.game-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.game-info {
  flex: 1;
}

.game-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 4px;
}

.game-progress-mini {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-purple));
  border-radius: 2px;
}
```

### 2. Головна панель (Main Content):
```tsx
<div className="main-content">
  {selectedGame ? (
    <>
      {/* Великий банер гри */}
      <div className="game-hero">
        <div className="hero-bg">
          <img src={selectedGame.banner} alt="" className="hero-bg-img" />
          <div className="hero-gradient-overlay" />
        </div>
        <div className="hero-content">
          <div className="game-logo-container">
            <img src={selectedGame.logo} alt={selectedGame.name} />
          </div>
        </div>
      </div>

      {/* Інформаційні картки */}
      <div className="info-cards-grid">
        {/* Статус перекладу */}
        <div className="glass-card status-card">
          <h3>Прогрес перекладу</h3>
          <div className="progress-section">
            <ProgressBar
              label="Переклад"
              value={selectedGame.progress.translation}
              color="var(--neon-blue)"
            />
            <ProgressBar
              label="Редагування"
              value={selectedGame.progress.editing}
              color="var(--neon-purple)"
            />
            <ProgressBar
              label="Озвучення"
              value={selectedGame.progress.voicing}
              color="var(--neon-pink)"
            />
          </div>
        </div>

        {/* Інформація */}
        <div className="glass-card info-card">
          <h3>Інформація</h3>
          <div className="info-grid">
            <InfoItem icon="🎮" label="Платформи" value={platformsText} />
            <InfoItem icon="📦" label="Розмір" value={selectedGame.size} />
            <InfoItem icon="📅" label="Оновлено" value={selectedGame.updated} />
            <InfoItem icon="👥" label="Команда" value={selectedGame.team} />
          </div>
        </div>

        {/* Опис */}
        <div className="glass-card description-card">
          <h3>Про переклад</h3>
          <p>{selectedGame.description}</p>
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="action-buttons">
        <button className="btn-primary glass-button-gradient">
          <DownloadIcon />
          Встановити переклад
        </button>
        <button className="btn-secondary glass-button">
          <HeartIcon />
          Підтримати проєкт
        </button>
      </div>
    </>
  ) : (
    <div className="empty-state">
      <GamepadIcon />
      <h2>Оберіть гру зі списку</h2>
      <p>Виберіть гру, щоб побачити деталі та встановити переклад</p>
    </div>
  )}
</div>
```

### 3. Progress Bar Component:
```tsx
const ProgressBar = ({ label, value, color }) => (
  <div className="progress-wrapper">
    <div className="progress-meta">
      <span className="progress-label">{label}</span>
      <span className="progress-value">{value}%</span>
    </div>
    <div className="progress-track">
      <div
        className="progress-bar"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}`
        }}
      />
    </div>
  </div>
);
```

**Стилі для прогрес-бара:**
```css
.progress-wrapper {
  margin-bottom: 20px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.progress-label {
  color: var(--text-muted);
  font-weight: 500;
}

.progress-value {
  color: white;
  font-weight: 700;
}

.progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  animation: progressGlow 2s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### 4. Gradient Buttons:
```css
.btn-primary {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  color: white;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 114, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 114, 255, 0.6);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: white;
  transform: translateY(-2px);
}
```

---

## 🛠️ ТЕХНІЧНИЙ СТЕК

```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "electron-builder": "^24.9.1",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

**Package Manager:** pnpm

---

## 📁 СТРУКТУРА ПРОЄКТУ

```
little-bit/
├── .github/
│   └── workflows/
│       └── build.yml              # GitHub Actions автобілд
├── src/
│   ├── main/                      # Electron Main Process
│   │   ├── index.ts               # Entry point
│   │   ├── window.ts              # Window management
│   │   ├── updater.ts             # Auto-updater
│   │   └── installer.ts           # Translation installer logic
│   ├── preload/
│   │   └── index.ts               # Preload script (IPC bridge)
│   ├── renderer/                  # React App
│   │   ├── components/
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── GameListItem.tsx
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── MainContent/
│   │   │   │   ├── GameHero.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── StatusCard.tsx
│   │   │   │   └── InfoCard.tsx
│   │   │   ├── Layout/
│   │   │   │   ├── AmbientBackground.tsx
│   │   │   │   └── GlassPanel.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       └── Input.tsx
│   │   ├── styles/
│   │   │   ├── globals.css        # Global + glassmorphism стилі
│   │   │   └── animations.css     # Animations
│   │   ├── store/
│   │   │   └── useStore.ts        # Zustand store
│   │   ├── types/
│   │   │   └── game.ts            # TypeScript типи
│   │   ├── utils/
│   │   │   └── api.ts             # API для завантаження даних
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── shared/
│       ├── types.ts               # Shared types
│       └── constants.ts
├── resources/                     # Icons, assets
│   ├── icon.png
│   └── logo.png
├── public/
│   └── translations/              # JSON з даними про переклади
│       └── games.json
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── electron-builder.yml
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚙️ ФУНКЦІОНАЛЬНІСТЬ

### 1. Завантаження списку ігор:
```typescript
// src/renderer/utils/api.ts
export interface Game {
  id: string;
  name: string;
  nameUk: string;
  banner: string;
  logo: string;
  thumbnail: string;
  progress: {
    translation: number;
    editing: number;
    voicing: number;
  };
  platforms: ('steam' | 'gog' | 'epic')[];
  size: string;
  updated: string;
  team: string;
  description: string;
  downloadUrl: string;
  installPaths: {
    steam?: string;
    gog?: string;
    epic?: string;
  };
  status: 'in-progress' | 'done' | 'early-access' | 'funded';
}

export async function fetchGames(): Promise<Game[]> {
  // Завантаження з GitHub або власного API
  const response = await fetch('https://api.github.com/repos/YOUR_ORG/translations/releases');
  const data = await response.json();
  return parseGamesFromReleases(data);
}
```

### 2. Детекція встановлених ігор:
```typescript
// src/main/installer.ts
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export async function detectInstalledGames(): Promise<Map<string, string>> {
  const installedGames = new Map<string, string>();
  
  // Steam detection (Windows Registry)
  if (process.platform === 'win32') {
    const steamPath = await getSteamPath();
    if (steamPath) {
      const libraryFolders = await getSteamLibraryFolders(steamPath);
      for (const folder of libraryFolders) {
        // Scan for games
      }
    }
  }
  
  // GOG detection
  // Epic detection
  
  return installedGames;
}
```

### 3. Встановлення перекладу:
```typescript
// src/main/installer.ts
export async function installTranslation(
  gameId: string,
  downloadUrl: string,
  installPath: string
): Promise<void> {
  // 1. Скачати архів перекладу
  const archivePath = await downloadTranslation(downloadUrl);
  
  // 2. Розпакувати
  await extractArchive(archivePath, installPath);
  
  // 3. Застосувати патчі (якщо потрібно)
  await applyPatches(gameId, installPath);
  
  // 4. Очистити тимчасові файли
  await cleanup(archivePath);
}

async function downloadTranslation(url: string): Promise<string> {
  const { net } = require('electron');
  const tempDir = app.getPath('temp');
  const fileName = `translation_${Date.now()}.zip`;
  const filePath = path.join(tempDir, fileName);
  
  // Download with progress
  return new Promise((resolve, reject) => {
    const request = net.request(url);
    const file = fs.createWriteStream(filePath);
    
    request.on('response', (response) => {
      response.pipe(file);
      response.on('end', () => resolve(filePath));
    });
    
    request.on('error', reject);
    request.end();
  });
}
```

### 4. Автооновлення списку перекладів:
```typescript
// src/renderer/store/useStore.ts
import create from 'zustand';
import { fetchGames, type Game } from '../utils/api';

interface Store {
  games: Game[];
  selectedGame: Game | null;
  filter: string;
  searchQuery: string;
  
  fetchGames: () => Promise<void>;
  setSelectedGame: (game: Game | null) => void;
  setFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  games: [],
  selectedGame: null,
  filter: 'all',
  searchQuery: '',
  
  fetchGames: async () => {
    const games = await fetchGames();
    set({ games });
  },
  
  setSelectedGame: (game) => set({ selectedGame: game }),
  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
```

---

## 🚀 GITHUB ACTIONS (Автобілд)

```yaml
# .github/workflows/build.yml
name: Build and Release

on:
  push:
    tags:
      - 'v*.*.*'
  workflow_dispatch:

jobs:
  build:
    strategy:
      matrix:
        os:
          - name: windows
            runner: windows-latest
            artifact: '*.exe'
          - name: linux
            runner: ubuntu-latest
            artifact: '*.{AppImage,deb,rpm}'
          - name: macos
            runner: macos-latest
            artifact: '*.dmg'
    
    runs-on: ${{ matrix.os.runner }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
      
      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build Electron app
        run: pnpm build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.os.name }}-build
          path: |
            dist/${{ matrix.os.artifact }}
      
      - name: Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: dist/${{ matrix.os.artifact }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 📦 ELECTRON BUILDER CONFIG

```yaml
# electron-builder.yml
appId: ua.littlebit.app
productName: Little Bit - Українські локалізації ігор
copyright: Copyright © 2024

directories:
  output: dist
  buildResources: resources

files:
  - '!**/.vscode/*'
  - '!src/*'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}'

asarUnpack:
  - resources/**

win:
  executableName: LittleBit
  target:
    - target: nsis
      arch:
        - x64
        - arm64
  icon: resources/icon.ico

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: always
  createStartMenuShortcut: true

mac:
  entitlementsInherit: build/entitlements.mac.plist
  extendInfo:
    NSCameraUsageDescription: Додаток не використовує камеру
    NSMicrophoneUsageDescription: Додаток не використовує мікрофон
    NSDocumentsFolderUsageDescription: Для встановлення перекладів
  notarize: false
  target:
    - target: dmg
      arch:
        - x64
        - arm64
  icon: resources/icon.icns

dmg:
  contents:
    - x: 410
      y: 150
      type: link
      path: /Applications
    - x: 130
      y: 150
      type: file

linux:
  target:
    - target: AppImage
      arch:
        - x64
        - arm64
    - target: deb
      arch:
        - x64
        - arm64
    - target: rpm
      arch:
        - x64
        - arm64
  icon: resources/icon.png
  category: Utility
```

---

## 📄 PACKAGE.JSON SCRIPTS

```json
{
  "name": "little-bit",
  "version": "1.0.0",
  "description": "Інсталятор українських перекладів ігор",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && electron-builder",
    "preview": "vite preview",
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "vite build && electron-builder",
    "electron:build:win": "vite build && electron-builder --win",
    "electron:build:mac": "vite build && electron-builder --mac",
    "electron:build:linux": "vite build && electron-builder --linux",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

---

## 🗂️ GITHUB STORAGE ДЛЯ ПЕРЕКЛАДІВ

### Структура репозиторіїв:

**Рекомендую 2 репозиторії:**

1. **`little-bit/app`** - Сам Electron додаток
2. **`little-bit/translations`** - Переклади та метадані

---

### Репозиторій `little-bit/translations`

```
little-bit/translations/
├── README.md
├── games.json                    # Мастер-файл з усіма іграми
├── .github/
│   └── workflows/
│       ├── validate.yml          # Валідація games.json
│       └── create-release.yml    # Автоматичне створення релізів
└── scripts/
    ├── add-game.js              # Скрипт для додавання нової гри
    └── update-metadata.js       # Оновлення метаданих
```

#### games.json структура:
```json
{
  "version": "1.0.0",
  "updated": "2024-11-24T12:00:00Z",
  "cdn": "https://github.com/little-bit/translations/releases/download",
  "games": [
    {
      "id": "yakuza-kiwami-2",
      "slug": "yakuza-k2",
      "name": "Yakuza Kiwami 2",
      "nameUk": "Якудза Ківамі 2",
      "banner": "https://raw.githubusercontent.com/little-bit/translations/main/assets/banners/yakuza-k2.jpg",
      "logo": "https://raw.githubusercontent.com/little-bit/translations/main/assets/logos/yakuza-k2.png",
      "thumbnail": "https://raw.githubusercontent.com/little-bit/translations/main/assets/thumbs/yakuza-k2-thumb.jpg",
      "version": "1.0.2",
      "progress": {
        "translation": 99,
        "editing": 52,
        "voicing": 0
      },
      "platforms": ["steam", "gog"],
      "size": "156 MB",
      "updated": "2024-11-20T15:30:00Z",
      "team": "Little Bit UA",
      "description": "Повний український переклад Yakuza Kiwami 2. Переклад включає всі діалоги, текст та інтерфейс.",
      "releaseTag": "yakuza-k2-v1.0.2",
      "downloadFileName": "translation.zip",
      "installPaths": {
        "steam": "steamapps/common/Yakuza Kiwami 2/data",
        "gog": "Games/Yakuza Kiwami 2/data"
      },
      "installInstructions": {
        "uk": "1. Розпакуйте архів\n2. Скопіюйте файли в папку з грою\n3. Запустіть гру",
        "en": "1. Extract archive\n2. Copy files to game folder\n3. Launch game"
      },
      "status": "in-progress",
      "requirements": {
        "gameVersion": "1.0.0+",
        "diskSpace": "200 MB"
      },
      "changelog": [
        {
          "version": "1.0.2",
          "date": "2024-11-20",
          "changes": ["Виправлено помилки в розділі 5", "Покращено переклад діалогів"]
        },
        {
          "version": "1.0.1",
          "date": "2024-11-10",
          "changes": ["Початковий реліз"]
        }
      ]
    }
  ]
}
```

---

### GitHub Actions для автоматизації

#### `.github/workflows/create-release.yml`
```yaml
name: Create Translation Release

on:
  workflow_dispatch:
    inputs:
      game_id:
        description: 'Game ID (e.g., yakuza-k2)'
        required: true
      version:
        description: 'Version (e.g., 1.0.2)'
        required: true
      translation_zip:
        description: 'Path to translation.zip in repository'
        required: true

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Read game metadata
        id: metadata
        run: |
          GAME_NAME=$(jq -r ".games[] | select(.id==\"${{ github.event.inputs.game_id }}\") | .name" games.json)
          echo "game_name=$GAME_NAME" >> $GITHUB_OUTPUT
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: ${{ github.event.inputs.game_id }}-v${{ github.event.inputs.version }}
          name: ${{ steps.metadata.outputs.game_name }} v${{ github.event.inputs.version }}
          body: |
            ## ${{ steps.metadata.outputs.game_name }} - Український переклад v${{ github.event.inputs.version }}
            
            ### Встановлення
            1. Завантажте `translation.zip`
            2. Розпакуйте в папку з грою
            3. Запустіть гру
            
            ### Зміни
            Дивіться CHANGELOG.md для деталей
          files: ${{ github.event.inputs.translation_zip }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Update games.json
        run: |
          # Оновити updated timestamp та version в games.json
          node scripts/update-metadata.js \
            --game-id "${{ github.event.inputs.game_id }}" \
            --version "${{ github.event.inputs.version }}"
      
      - name: Commit changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add games.json
          git commit -m "Update ${{ github.event.inputs.game_id }} to v${{ github.event.inputs.version }}"
          git push
```

#### `scripts/add-game.js`
```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Додавання нової гри до games.json
const newGame = {
  id: process.argv[2],
  slug: process.argv[3],
  name: process.argv[4],
  nameUk: process.argv[5],
  // ... інші поля
};

const gamesPath = path.join(__dirname, '..', 'games.json');
const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

data.games.push(newGame);
data.updated = new Date().toISOString();

fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2));
console.log(`✅ Added ${newGame.name} to games.json`);
```

---

### Workflow для розробників перекладів

#### 1. Додати нову гру:
```bash
# Створити нову гілку
git checkout -b add-game-judgment

# Додати асети
mkdir -p assets/{banners,logos,thumbs}
# Завантажити зображення...

# Додати гру до games.json
node scripts/add-game.js \
  "judgment" \
  "judgment" \
  "Judgment" \
  "Джаджмент"

# Commit
git add .
git commit -m "Add Judgment to games list"
git push origin add-game-judgment

# Create PR
gh pr create --title "Add Judgment" --body "Adding Judgment game"
```

#### 2. Оновити переклад:
```bash
# Підготувати переклад
cd ~/translations/judgment
zip -r translation.zip ./

# Завантажити на GitHub
gh release create judgment-v1.0.2 \
  translation.zip \
  --title "Judgment v1.0.2" \
  --notes "Виправлено помилки в розділі 3"

# Оновити games.json вручну або через workflow
```

---

### У Electron додатку

#### Завантаження списку ігор:
```typescript
// src/renderer/utils/api.ts
const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'little-bit';
const REPO_NAME = 'translations';

export async function fetchGames(): Promise<Game[]> {
  // Завантажити games.json з GitHub
  const response = await fetch(
    `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/games.json`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch games list');
  }
  
  const data = await response.json();
  return data.games;
}

// Альтернатива: через GitHub API (з rate limiting)
export async function fetchGamesViaAPI(): Promise<Game[]> {
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/games.json`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Додати токен якщо потрібно більше rate limit:
        // 'Authorization': `token ${GITHUB_TOKEN}`
      }
    }
  );
  
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  const games = JSON.parse(content);
  
  return games.games;
}
```

#### Завантаження перекладу:
```typescript
// src/main/installer.ts
import { app, net } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

const REPO_OWNER = 'little-bit';
const REPO_NAME = 'translations';

export async function downloadTranslation(
  game: Game,
  onProgress?: (progress: number) => void
): Promise<string> {
  const downloadUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${game.releaseTag}/${game.downloadFileName}`;
  
  const tempDir = app.getPath('temp');
  const fileName = `${game.id}_${game.version}.zip`;
  const filePath = path.join(tempDir, fileName);
  
  return new Promise((resolve, reject) => {
    const request = net.request(downloadUrl);
    const file = fs.createWriteStream(filePath);
    
    let downloadedBytes = 0;
    let totalBytes = 0;
    
    request.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'] as string, 10);
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (onProgress && totalBytes > 0) {
          const progress = (downloadedBytes / totalBytes) * 100;
          onProgress(progress);
        }
      });
      
      response.pipe(file);
      
      response.on('end', () => {
        file.close();
        resolve(filePath);
      });
    });
    
    request.on('error', (error) => {
      fs.unlink(filePath, () => {});
      reject(error);
    });
    
    request.end();
  });
}

// Перевірка оновлень
export async function checkForUpdates(currentGames: Game[]): Promise<Game[]> {
  const latestGames = await fetchGames();
  const updates: Game[] = [];
  
  for (const latestGame of latestGames) {
    const currentGame = currentGames.find(g => g.id === latestGame.id);
    
    if (!currentGame) {
      updates.push(latestGame);
    } else if (latestGame.version !== currentGame.version) {
      updates.push(latestGame);
    }
  }
  
  return updates;
}
```

#### Кешування games.json:
```typescript
// src/renderer/store/useStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
  games: Game[];
  lastFetched: number | null;
  fetchGames: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      games: [],
      lastFetched: null,
      
      fetchGames: async () => {
        const now = Date.now();
        const lastFetched = get().lastFetched;
        
        // Кешувати на 1 годину
        if (lastFetched && now - lastFetched < 60 * 60 * 1000) {
          return;
        }
        
        const games = await fetchGames();
        set({ games, lastFetched: now });
      },
    }),
    {
      name: 'little-bit-storage',
      partialize: (state) => ({
        games: state.games,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
```

---

### Rate Limiting GitHub API

GitHub дає:
- **Без авторизації:** 60 запитів/годину
- **З токеном:** 5000 запитів/годину

**Рекомендація:**
- Використовуй Raw GitHub URL для games.json (не лімітується)
- Кешуй локально
- Оновлюй раз на годину

```typescript
// Завантаження без rate limit
const GAMES_JSON_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/games.json`;

async function fetchGamesWithCache(): Promise<Game[]> {
  // Спробувати з кешу
  const cached = localStorage.getItem('games_cache');
  const cacheTime = localStorage.getItem('games_cache_time');
  
  if (cached && cacheTime) {
    const age = Date.now() - parseInt(cacheTime);
    if (age < 3600000) { // 1 година
      return JSON.parse(cached);
    }
  }
  
  // Завантажити свіже
  const response = await fetch(GAMES_JSON_URL);
  const data = await response.json();
  
  localStorage.setItem('games_cache', JSON.stringify(data.games));
  localStorage.setItem('games_cache_time', Date.now().toString());
  
  return data.games;
}
```

---

### Бонус: GitHub Pages для веб-версії

Можна також зробити веб-версію на GitHub Pages:

```
little-bit/translations/
├── docs/                    # GitHub Pages
│   ├── index.html          # Веб-каталог перекладів
│   ├── style.css
│   └── app.js
└── ...
```

Потім додати до додатку кнопку "Переглянути в браузері" → `https://little-bit.github.io/translations/`

---

### Переваги GitHub підходу:

✅ **Безкоштовно** - необмежене зберігання для публічних репо  
✅ **CDN** - GitHub автоматично роздає файли через CDN  
✅ **Версіонування** - повна історія змін  
✅ **API** - простий доступ програмно  
✅ **Releases** - зручне управління версіями  
✅ **Actions** - автоматизація всього  
✅ **Community** - люди можуть робити PR з виправленнями  
✅ **Transparancy** - відкритий процес розробки

---

## 🗂️ ФОРМАТ ДАНИХ (games.json)

```json
{
  "version": "1.0.0",
  "updated": "2024-11-24T00:00:00Z",
  "games": [
    {
      "id": "yakuza-kiwami-2",
      "name": "Yakuza Kiwami 2",
      "nameUk": "Якудза Ківамі 2",
      "banner": "https://cdn.example.com/banners/yakuza-k2.jpg",
      "logo": "https://cdn.example.com/logos/yakuza-k2.png",
      "thumbnail": "https://cdn.example.com/thumbs/yakuza-k2-thumb.jpg",
      "progress": {
        "translation": 99,
        "editing": 52,
        "voicing": 0
      },
      "platforms": ["steam", "gog"],
      "size": "156 MB",
      "updated": "2024-11-20",
      "team": "Little Bit UA",
      "description": "Повний український переклад Yakuza Kiwami 2. Переклад включає всі діалоги, текст та інтерфейс.",
      "downloadUrl": "https://github.com/YOUR_ORG/translations/releases/download/yakuza-k2-v1.0/translation.zip",
      "installPaths": {
        "steam": "steamapps/common/Yakuza Kiwami 2",
        "gog": "Games/Yakuza Kiwami 2"
      },
      "status": "in-progress"
    },
    {
      "id": "judgment",
      "name": "Judgment",
      "nameUk": "Джаджмент",
      "banner": "https://cdn.example.com/banners/judgment.jpg",
      "logo": "https://cdn.example.com/logos/judgment.png",
      "thumbnail": "https://cdn.example.com/thumbs/judgment-thumb.jpg",
      "progress": {
        "translation": 100,
        "editing": 100,
        "voicing": 15
      },
      "platforms": ["steam"],
      "size": "234 MB",
      "updated": "2024-11-15",
      "team": "Little Bit UA",
      "description": "Завершений переклад Judgment українською мовою. Включає повний текст, озвучення основних сцен.",
      "downloadUrl": "https://github.com/YOUR_ORG/translations/releases/download/judgment-v2.0/translation.zip",
      "installPaths": {
        "steam": "steamapps/common/Judgment"
      },
      "status": "done"
    }
  ]
}
```

---

## 📚 ПОКРОКОВЕ НАЛАШТУВАННЯ GITHUB

### Крок 1: Створення репозиторіїв

```bash
# 1. Репозиторій для додатку
gh repo create little-bit/app \
  --public \
  --description "Little Bit - Інсталятор українських перекладів ігор"

# 2. Репозиторій для перекладів
gh repo create little-bit/translations \
  --public \
  --description "Українські переклади відеоігор"

# Клонувати
git clone https://github.com/little-bit/translations.git
cd translations
```

### Крок 2: Початкова структура

```bash
# Створити директорії
mkdir -p assets/{banners,logos,thumbs}
mkdir -p scripts
mkdir -p .github/workflows

# README.md
cat > README.md << 'EOF'
# 🎮 Little Bit - Українські переклади ігор

Цей репозиторій містить метадані та релізи українських перекладів відеоігор.

## 📥 Як завантажити переклад

1. Завантажте додаток [Little Bit](https://github.com/little-bit/app/releases)
2. Оберіть гру зі списку
3. Натисніть "Встановити переклад"

## 👨‍💻 Для розробників

### Додати нову гру:
\`\`\`bash
node scripts/add-game.js game-id slug "Game Name" "Українська Назва"
\`\`\`

### Випустити переклад:
\`\`\`bash
# Підготувати архів
cd ~/my-translation
zip -r translation.zip ./

# Створити реліз
gh release create game-id-v1.0.0 translation.zip \
  --title "Game Name v1.0.0" \
  --notes "Опис змін"

# Оновити games.json
node scripts/update-metadata.js --game-id game-id --version 1.0.0
\`\`\`

## 📁 Структура

- `games.json` - Список усіх ігор з метаданими
- `assets/` - Зображення (банери, логотипи)
- `scripts/` - Утиліти для управління
- Releases - Архіви перекладів

## 📊 Статистика

![GitHub release (latest by date)](https://img.shields.io/github/v/release/little-bit/translations)
![GitHub all releases](https://img.shields.io/github/downloads/little-bit/translations/total)

## 🤝 Як долучитися

1. Fork репозиторій
2. Додай свій переклад
3. Створи Pull Request

## 📄 Ліцензія

MIT
EOF

# games.json
cat > games.json << 'EOF'
{
  "version": "1.0.0",
  "updated": "2024-11-24T12:00:00Z",
  "cdn": "https://github.com/little-bit/translations/releases/download",
  "games": []
}
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
*.zip
*.tmp
.DS_Store
.env
EOF
```

### Крок 3: Скрипти для автоматизації

```bash
# scripts/add-game.js
cat > scripts/add-game.js << 'EOF'
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

if (process.argv.length < 6) {
  console.error('Usage: node add-game.js <id> <slug> <name> <nameUk>');
  process.exit(1);
}

const [, , id, slug, name, nameUk] = process.argv;

const newGame = {
  id,
  slug,
  name,
  nameUk,
  banner: `https://raw.githubusercontent.com/little-bit/translations/main/assets/banners/${slug}.jpg`,
  logo: `https://raw.githubusercontent.com/little-bit/translations/main/assets/logos/${slug}.png`,
  thumbnail: `https://raw.githubusercontent.com/little-bit/translations/main/assets/thumbs/${slug}-thumb.jpg`,
  version: "0.0.0",
  progress: {
    translation: 0,
    editing: 0,
    voicing: 0
  },
  platforms: [],
  size: "0 MB",
  updated: new Date().toISOString(),
  team: "Little Bit UA",
  description: "Опис перекладу...",
  releaseTag: `${slug}-v0.0.0`,
  downloadFileName: "translation.zip",
  installPaths: {},
  installInstructions: {
    uk: "1. Розпакуйте архів\n2. Скопіюйте файли в папку з грою\n3. Запустіть гру",
    en: "1. Extract archive\n2. Copy files to game folder\n3. Launch game"
  },
  status: "in-progress",
  requirements: {
    gameVersion: "1.0.0+",
    diskSpace: "100 MB"
  },
  changelog: []
};

const gamesPath = path.join(__dirname, '..', 'games.json');
const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

data.games.push(newGame);
data.updated = new Date().toISOString();

fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2) + '\n');
console.log(`✅ Додано ${name} до games.json`);
console.log(`\n📝 Не забудьте додати зображення:`);
console.log(`   assets/banners/${slug}.jpg`);
console.log(`   assets/logos/${slug}.png`);
console.log(`   assets/thumbs/${slug}-thumb.jpg`);
EOF

chmod +x scripts/add-game.js

# scripts/update-metadata.js
cat > scripts/update-metadata.js << 'EOF'
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const gameId = args[args.indexOf('--game-id') + 1];
const version = args[args.indexOf('--version') + 1];

if (!gameId || !version) {
  console.error('Usage: node update-metadata.js --game-id <id> --version <version>');
  process.exit(1);
}

const gamesPath = path.join(__dirname, '..', 'games.json');
const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

const game = data.games.find(g => g.id === gameId);
if (!game) {
  console.error(`❌ Гру ${gameId} не знайдено`);
  process.exit(1);
}

game.version = version;
game.updated = new Date().toISOString();
game.releaseTag = `${game.slug}-v${version}`;

data.updated = new Date().toISOString();

fs.writeFileSync(gamesPath, JSON.stringify(data, null, 2) + '\n');
console.log(`✅ Оновлено ${game.name} до версії ${version}`);
EOF

chmod +x scripts/update-metadata.js

# scripts/validate.js
cat > scripts/validate.js << 'EOF'
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const gamesPath = path.join(__dirname, '..', 'games.json');
const data = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

let errors = 0;

console.log('🔍 Валідація games.json...\n');

// Перевірка структури
if (!data.version || !data.updated || !Array.isArray(data.games)) {
  console.error('❌ Невірна структура games.json');
  process.exit(1);
}

// Перевірка кожної гри
data.games.forEach((game, index) => {
  const required = ['id', 'slug', 'name', 'nameUk', 'progress', 'platforms'];
  
  required.forEach(field => {
    if (!game[field]) {
      console.error(`❌ Гра #${index + 1}: відсутнє поле "${field}"`);
      errors++;
    }
  });
  
  // Перевірка прогресу
  if (game.progress) {
    ['translation', 'editing', 'voicing'].forEach(type => {
      const val = game.progress[type];
      if (typeof val !== 'number' || val < 0 || val > 100) {
        console.error(`❌ ${game.name}: невірне значення progress.${type}`);
        errors++;
      }
    });
  }
});

if (errors === 0) {
  console.log('✅ Валідація пройшла успішно!');
  console.log(`📊 Всього ігор: ${data.games.length}`);
} else {
  console.error(`\n❌ Знайдено помилок: ${errors}`);
  process.exit(1);
}
EOF

chmod +x scripts/validate.js
```

### Крок 4: GitHub Actions

```bash
# .github/workflows/validate.yml
cat > .github/workflows/validate.yml << 'EOF'
name: Validate games.json

on:
  push:
    paths:
      - 'games.json'
  pull_request:
    paths:
      - 'games.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Validate games.json
        run: node scripts/validate.js
EOF

# .github/workflows/create-release.yml
cat > .github/workflows/create-release.yml << 'EOF'
name: Create Translation Release

on:
  workflow_dispatch:
    inputs:
      game_id:
        description: 'Game ID (наприклад: yakuza-k2)'
        required: true
        type: string
      version:
        description: 'Версія (наприклад: 1.0.2)'
        required: true
        type: string
      changelog:
        description: 'Опис змін'
        required: false
        type: string
        default: 'Оновлення перекладу'

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Read game metadata
        id: metadata
        run: |
          GAME_NAME=$(node -e "const data = require('./games.json'); const game = data.games.find(g => g.id === '${{ inputs.game_id }}'); console.log(game ? game.name : 'Unknown');")
          GAME_SLUG=$(node -e "const data = require('./games.json'); const game = data.games.find(g => g.id === '${{ inputs.game_id }}'); console.log(game ? game.slug : 'unknown');")
          echo "game_name=$GAME_NAME" >> $GITHUB_OUTPUT
          echo "game_slug=$GAME_SLUG" >> $GITHUB_OUTPUT
      
      - name: Check if translation file exists
        run: |
          if [ ! -f "translations/${{ inputs.game_id }}/translation.zip" ]; then
            echo "❌ Файл translations/${{ inputs.game_id }}/translation.zip не знайдено"
            echo "Завантажте translation.zip перед створенням релізу"
            exit 1
          fi
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: ${{ steps.metadata.outputs.game_slug }}-v${{ inputs.version }}
          name: ${{ steps.metadata.outputs.game_name }} v${{ inputs.version }}
          body: |
            ## 🎮 ${{ steps.metadata.outputs.game_name }} - Український переклад v${{ inputs.version }}
            
            ### 📥 Встановлення
            
            **Автоматично через додаток:**
            1. Завантажте [Little Bit](https://github.com/little-bit/app/releases)
            2. Оберіть гру зі списку
            3. Натисніть "Встановити переклад"
            
            **Вручну:**
            1. Завантажте `translation.zip`
            2. Розпакуйте архів
            3. Скопіюйте файли в папку з грою
            4. Запустіть гру
            
            ### 📝 Зміни
            ${{ inputs.changelog }}
            
            ---
            
            💙 Дякуємо за підтримку українських перекладів!
          files: translations/${{ inputs.game_id }}/translation.zip
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Update games.json
        run: |
          node scripts/update-metadata.js \
            --game-id "${{ inputs.game_id }}" \
            --version "${{ inputs.version }}"
      
      - name: Commit updated metadata
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add games.json
          git commit -m "🔄 Update ${{ inputs.game_id }} to v${{ inputs.version }}"
          git push
EOF
```

### Крок 5: Перший коміт

```bash
git add .
git commit -m "🎉 Initial setup: Little Bit translations repository"
git push origin main
```

---

## 🎮 ПРИКЛАД: Додавання першої гри

### 1. Додати метадані:

```bash
node scripts/add-game.js \
  "yakuza-kiwami-2" \
  "yakuza-k2" \
  "Yakuza Kiwami 2" \
  "Якудза Ківамі 2"
```

### 2. Додати зображення:

```bash
# Завантажити або створити зображення
cp ~/images/yakuza-k2-banner.jpg assets/banners/yakuza-k2.jpg
cp ~/images/yakuza-k2-logo.png assets/logos/yakuza-k2.png
cp ~/images/yakuza-k2-thumb.jpg assets/thumbs/yakuza-k2-thumb.jpg

# Оптимізувати (опціонально)
# brew install imagemagick
convert assets/banners/yakuza-k2.jpg -resize 1920x1080^ -quality 85 assets/banners/yakuza-k2.jpg
convert assets/logos/yakuza-k2.png -resize 800x assets/logos/yakuza-k2.png
convert assets/thumbs/yakuza-k2-thumb.jpg -resize 400x400^ -quality 85 assets/thumbs/yakuza-k2-thumb.jpg
```

### 3. Оновити games.json вручну:

```bash
# Відкрити в редакторі і заповнити деталі
code games.json

# Або через jq
jq '.games[0] |= . + {
  "progress": {
    "translation": 99,
    "editing": 52,
    "voicing": 0
  },
  "platforms": ["steam", "gog"],
  "size": "156 MB",
  "description": "Повний український переклад Yakuza Kiwami 2..."
}' games.json > games.json.tmp && mv games.json.tmp games.json
```

### 4. Підготувати переклад:

```bash
# Створити папку для перекладу
mkdir -p translations/yakuza-kiwami-2

# Підготувати файли перекладу
cd ~/my-yakuza-translation
zip -r translation.zip ./*

# Скопіювати в репозиторій
cp translation.zip ~/translations/translations/yakuza-kiwami-2/
```

### 5. Створити реліз через GitHub Actions:

```bash
# Commit файлів
cd ~/translations
git add .
git commit -m "Add Yakuza Kiwami 2 translation files"
git push

# Створити реліз через web UI або CLI
gh workflow run create-release.yml \
  -f game_id=yakuza-kiwami-2 \
  -f version=1.0.0 \
  -f changelog="Початковий реліз перекладу Yakuza Kiwami 2"
```

**АБО через GitHub CLI напряму:**

```bash
gh release create yakuza-k2-v1.0.0 \
  translations/yakuza-kiwami-2/translation.zip \
  --title "Yakuza Kiwami 2 v1.0.0" \
  --notes "## Yakuza Kiwami 2 - Український переклад v1.0.0

### Встановлення
1. Завантажте translation.zip
2. Розпакуйте в папку з грою
3. Запустіть гру

### Статус
- Переклад: 99%
- Редагування: 52%
- Озвучення: 0%"
```

---

## 🔄 WORKFLOW ДЛЯ ОНОВЛЕНЬ

### Випустити нову версію перекладу:

```bash
# 1. Оновити файли перекладу
cd ~/my-yakuza-translation
# ... зробити зміни ...
zip -r translation.zip ./*

# 2. Додати в репозиторій
cp translation.zip ~/translations/translations/yakuza-kiwami-2/
cd ~/translations

# 3. Оновити changelog в games.json
jq '.games[] | select(.id == "yakuza-kiwami-2") | .changelog += [{
  "version": "1.0.1",
  "date": "'$(date -I)'",
  "changes": ["Виправлено помилки в розділі 3", "Покращено переклад діалогів"]
}]' games.json > games.json.tmp && mv games.json.tmp games.json

# 4. Commit
git add .
git commit -m "Update Yakuza Kiwami 2 to v1.0.1"
git push

# 5. Створити реліз
gh release create yakuza-k2-v1.0.1 \
  translations/yakuza-kiwami-2/translation.zip \
  --title "Yakuza Kiwami 2 v1.0.1" \
  --notes "Виправлення та покращення"

# 6. Оновити metadata
node scripts/update-metadata.js --game-id yakuza-kiwami-2 --version 1.0.1
git add games.json
git commit -m "Update metadata for Yakuza Kiwami 2 v1.0.1"
git push
```

---

## 📊 КОРИСНІ КОМАНДИ

### Перевірити games.json:
```bash
node scripts/validate.js
```

### Подивитися всі релізи:
```bash
gh release list
```

### Завантажити статистику:
```bash
gh api repos/little-bit/translations/releases | \
  jq '.[] | {name: .name, downloads: ([.assets[].download_count] | add)}'
```

### Видалити реліз:
```bash
gh release delete yakuza-k2-v1.0.0 --yes
git push --delete origin yakuza-k2-v1.0.0
```

### Backup games.json:
```bash
cp games.json games.backup.$(date +%Y%m%d).json
```

---

## 🎯 CHECKLIST ДЛЯ НОВОЇ ГРИ

- [ ] Додати через `add-game.js`
- [ ] Завантажити зображення (banner, logo, thumbnail)
- [ ] Заповнити деталі в `games.json`
- [ ] Підготувати `translation.zip`
- [ ] Створити папку `translations/[game-id]/`
- [ ] Commit і push
- [ ] Створити реліз через GitHub Actions або CLI
- [ ] Перевірити, що реліз доступний
- [ ] Протестувати завантаження в додатку
- [ ] Оголосити в соціальних мережах

---

## 🔥 ДОДАТКОВІ ФІЧІ

### 1. Автоапдейт перекладів:
```typescript
// Перевірка оновлень при запуску
app.on('ready', async () => {
  const updates = await checkForTranslationUpdates();
  if (updates.length > 0) {
    showNotification(`Доступні оновлення для ${updates.length} ігор`);
  }
});
```

### 2. Статистика встановлень (optional):
```typescript
// Відправляй анонімну статистику
await fetch('https://api.yourdomain.com/stats', {
  method: 'POST',
  body: JSON.stringify({
    gameId: 'yakuza-k2',
    action: 'install',
    version: '1.0',
    timestamp: Date.now(),
  }),
});
```

### 3. Інтеграція з Discord Rich Presence (optional):
```typescript
import DiscordRPC from 'discord-rpc';

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
rpc.on('ready', () => {
  rpc.setActivity({
    details: 'Встановлює переклад',
    state: 'Yakuza Kiwami 2',
    largeImageKey: 'logo',
  });
});
```

---

## 📝 КЛЮЧОВІ ЕЛЕМЕНТИ ДИЗАЙНУ

1. **Темний фон** з animated gradient blobs
2. **Glassmorphism** для всіх панелей (backdrop-filter: blur())
3. **Neon акценти** для hover states та прогрес-барів
4. **Smooth transitions** (cubic-bezier easing)
5. **Gradient кнопки** з glow ефектами
6. **Space Grotesk** для заголовків, **Inter** для тексту
7. **Floating animations** для фонових елементів
8. **3D transform effects** при hover на картках
9. **Progress bars** з animated glow
10. **Noise overlay** для додання текстури

---

## ✅ CHECKLIST

- [ ] Створи Electron + Vite + React проєкт
- [ ] Налаштуй pnpm
- [ ] Імплементуй glassmorphism дизайн з темним фоном
- [ ] Додай animated background (floating blobs)
- [ ] Створи компоненти: Sidebar, GameListItem, GameHero, ProgressBar
- [ ] Імплементуй Zustand store для state management
- [ ] Додай функціонал детекції встановлених ігор (Steam/GOG)
- [ ] Імплементуй завантаження та встановлення перекладів
- [ ] Налаштуй GitHub Actions для автобілду (Windows/Mac/Linux)
- [ ] Налаштуй electron-builder config
- [ ] Створи games.json з метаданими
- [ ] Налаштуй автооновлення списку ігор
- [ ] Додай пошук та фільтри
- [ ] Імплементуй progress tracking під час завантаження
- [ ] Додай error handling та notifications
- [ ] Протестуй на всіх платформах

---

**Створи повний робочий проєкт з усіма файлами згідно цього промпту!