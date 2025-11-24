# Little Bit Launcher 🎮

Інсталятор українських перекладів відеоігор

## Швидкий старт

```bash
# Встановити залежності
pnpm install

# Запустити в dev режимі
pnpm dev

# Зібрати проект
pnpm build

# Створити дистрибутив
pnpm dist        # Для вашої платформи
pnpm dist:win    # Для Windows
pnpm dist:linux  # Для Linux
```

## Технології

- **Electron + electron-vite** - Desktop framework & build tool
- **React + TypeScript** - UI
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **electron-updater** - Автооновлення

## Розробка

```bash
pnpm dev          # Dev mode з hot reload
pnpm type-check   # Перевірка типів
pnpm lint         # Lint
pnpm format       # Prettier
```

## Автоматичний реліз

### Просто push тег:

```bash
pnpm version patch  # 1.0.0 → 1.0.1
git push origin master --tags
```

GitHub Actions автоматично:
- ✅ Збере для Windows і Linux
- ✅ Створить GitHub Release
- ✅ Завантажить всі файли

**Детальніше:** [RELEASE.md](./RELEASE.md)

## Автооновлення

Додаток автоматично перевіряє оновлення при запуску.

**Детальніше:** [AUTO_UPDATE_SETUP.md](./AUTO_UPDATE_SETUP.md)

## Структура

```
src/
├── main/       # Electron main процес
├── preload/    # Preload скрипт (contextBridge)
├── renderer/   # React UI
└── shared/     # Спільні типи
```

## Ліцензія

MIT
