#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== LB Launcher Flatpak Build Script ===${NC}"

# Check if flatpak-builder is installed
if ! command -v flatpak-builder &> /dev/null; then
    echo -e "${RED}Error: flatpak-builder is not installed${NC}"
    echo "Install it with: sudo apt install flatpak-builder (Debian/Ubuntu)"
    echo "                 sudo dnf install flatpak-builder (Fedora)"
    exit 1
fi

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}Building Electron app...${NC}"
pnpm build
pnpm dist:linux

echo -e "${YELLOW}Finding tar.gz archive...${NC}"
TAR_FILE=$(find release -name "*.tar.gz" | head -1)
if [ -z "$TAR_FILE" ]; then
    echo -e "${RED}Error: No tar.gz file found in release directory${NC}"
    exit 1
fi
echo "Found: $TAR_FILE"

# Copy tar.gz to flatpak directory
cp "$TAR_FILE" flatpak/lb-launcher.tar.gz

# Calculate SHA256
SHA256=$(sha256sum flatpak/lb-launcher.tar.gz | cut -d' ' -f1)
echo -e "${GREEN}SHA256: $SHA256${NC}"

# Create local manifest with file source instead of URL
cat > flatpak/org.littlebit.Launcher.local.yml << EOF
app-id: org.littlebit.Launcher
runtime: org.freedesktop.Platform
runtime-version: '24.08'
sdk: org.freedesktop.Sdk
base: org.electronjs.Electron2.BaseApp
base-version: '24.08'
command: lb-launcher
separate-locales: false

finish-args:
  - --share=ipc
  - --socket=x11
  - --socket=wayland
  - --socket=fallback-x11
  - --share=network
  - --device=dri
  - --device=all
  - --filesystem=~/.steam:ro
  - --filesystem=~/.local/share/Steam:ro
  - --filesystem=~/.var/app/com.valvesoftware.Steam:rw
  - --filesystem=~/GOG Games:rw
  - --filesystem=/media:ro
  - --filesystem=/run/media:ro
  - --filesystem=/mnt:ro
  - --persist=.config/littlebit-launcher
  - --persist=.local/share/littlebit-launcher
  - --talk-name=org.freedesktop.Notifications
  - --talk-name=org.kde.StatusNotifierWatcher
  - --talk-name=org.freedesktop.portal.FileChooser

modules:
  - name: littlebit-launcher
    buildsystem: simple
    build-commands:
      - cp -r lb-launcher /app/
      - ln -s /app/lb-launcher/lb-launcher /app/bin/lb-launcher
      - install -Dm644 org.littlebit.Launcher.desktop /app/share/applications/org.littlebit.Launcher.desktop
      - install -Dm644 org.littlebit.Launcher.metainfo.xml /app/share/metainfo/org.littlebit.Launcher.metainfo.xml
      - install -Dm644 lb-launcher/resources/icon.png /app/share/icons/hicolor/256x256/apps/org.littlebit.Launcher.png
    sources:
      - type: archive
        path: lb-launcher.tar.gz
        sha256: $SHA256
        dest: lb-launcher
      - type: file
        path: org.littlebit.Launcher.desktop
      - type: file
        path: org.littlebit.Launcher.metainfo.xml
EOF

echo -e "${YELLOW}Building Flatpak...${NC}"
cd flatpak

# Install Electron BaseApp if needed
flatpak install -y flathub org.electronjs.Electron2.BaseApp//24.08 || true
flatpak install -y flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 || true

# Build Flatpak
flatpak-builder --force-clean build-dir org.littlebit.Launcher.local.yml

echo -e "${YELLOW}Creating local repository...${NC}"
flatpak-builder --repo=repo --force-clean build-dir org.littlebit.Launcher.local.yml

echo -e "${YELLOW}Installing locally...${NC}"
flatpak --user remote-add --if-not-exists littlebit-local repo --no-gpg-verify
flatpak --user install -y littlebit-local org.littlebit.Launcher || flatpak --user update -y org.littlebit.Launcher

echo -e "${GREEN}=== Build complete! ===${NC}"
echo -e "Run with: ${YELLOW}flatpak run org.littlebit.Launcher${NC}"

# Cleanup
rm -f lb-launcher.tar.gz org.littlebit.Launcher.local.yml
