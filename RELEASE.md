# Як створити реліз

## Автоматичний реліз через GitHub Actions

### 1. Оновіть версію

```bash
# Patch (1.0.0 → 1.0.1)
pnpm version patch

# Minor (1.0.1 → 1.1.0)
pnpm version minor

# Major (1.1.0 → 2.0.0)
pnpm version major

# Або вручну
pnpm version 1.2.3
```

### 2. Push з тегом

```bash
git push origin master --tags
```

### 3. Готово! 🎉

GitHub Actions автоматично:
- ✅ Збере додаток для Windows, macOS, Linux
- ✅ Створить GitHub Release
- ✅ Завантажить файли в релізи
- ✅ Користувачі отримають автооновлення

## Перегляд прогресу

Йдіть на: `https://github.com/your-username/littlebit-launcher/actions`

## Налаштування репозиторію

### Увімкніть write permissions для GITHUB_TOKEN

1. Йдіть в Settings → Actions → General
2. Scroll до "Workflow permissions"
3. Виберіть "Read and write permissions"
4. Збережіть

Це потрібно щоб GitHub Actions міг створювати релізи.

## Що робить workflow

`.github/workflows/release.yml`:
- Запускається при push тега `v*.*.*` (наприклад, v1.0.0)
- Збирає для Windows і Linux паралельно
- Публікує всі артефакти в один GitHub Release

## Ручна збірка (якщо потрібно)

```bash
# Локально зібрати для своєї платформи
pnpm build
pnpm dist

# Файли будуть в release/X.X.X/
```

## Приклад процесу релізу

```bash
# 1. Закомітьте зміни
git add .
git commit -m "feat: додано нову функцію"

# 2. Оновіть версію
pnpm version patch
# Це створить коміт "1.0.1" та тег "v1.0.1"

# 3. Push
git push origin master --tags

# 4. Чекайте ~10-15 хвилин
# GitHub Actions збере для всіх платформ

# 5. Готово!
# Перевірте: github.com/your-username/littlebit-launcher/releases
```

## Що буде в релізі

### Windows
- `Little-Bit-Setup-1.0.0.exe` - Installer
- `Little-Bit-1.0.0-win.zip` - Portable

### Linux
- `Little-Bit-1.0.0.AppImage` - Universal
- `little-bit_1.0.0_amd64.deb` - Debian/Ubuntu

## Rollback релізу

Якщо щось пішло не так:

```bash
# Видаліть тег локально
git tag -d v1.0.0

# Видаліть тег на GitHub
git push origin :refs/tags/v1.0.0

# Видаліть Release в GitHub UI
```

## Pre-release (бета версії)

Для тестування:

```bash
pnpm version prerelease --preid=beta
# Створить 1.0.0-beta.0

git push origin master --tags
```

В GitHub Release поставте галочку "Pre-release"

## Changelog

Рекомендую додавати в кожен реліз changelog:
- Що нового
- Що виправлено
- Breaking changes

Можна автоматизувати через https://github.com/conventional-changelog/conventional-changelog
