import { app, net } from 'electron';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import AdmZip from 'adm-zip';
import { fetchGames } from './api';
import { getFirstAvailableGamePath } from './game-detector';

const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

/**
 * Main installation function
 */
export async function installTranslation(
  gameId: string,
  platform: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    onProgress?.(5);

    // 1. Fetch game metadata
    const games = await fetchGames();
    const game = games.find((g) => g.id === gameId);

    if (!game) {
      throw new Error(`Гру ${gameId} не знайдено`);
    }

    onProgress?.(10);

    // 2. Detect game installation path
    const gamePath = getFirstAvailableGamePath(game.installPaths);

    if (!gamePath || !gamePath.exists) {
      throw new Error(
        `Гру не знайдено на вашому комп'ютері.\n\n` +
          `Переконайтесь, що гра встановлена через ${platform.toUpperCase()}.`
      );
    }

    console.log(`Game found at: ${gamePath.path}`);
    onProgress?.(20);

    // 3. Download translation archive
    const tempDir = app.getPath('temp');
    const downloadDir = path.join(tempDir, 'little-bit-downloads');
    await mkdir(downloadDir, { recursive: true });

    const archivePath = path.join(downloadDir, `${gameId}_translation.zip`);

    await downloadFile(game.downloadUrl, archivePath, (downloadProgress) => {
      // Map download progress to 20-70%
      const overallProgress = 20 + downloadProgress * 0.5;
      onProgress?.(overallProgress);
    });

    onProgress?.(70);

    // 4. Extract archive
    const extractDir = path.join(downloadDir, `${gameId}_extract`);
    await extractArchive(archivePath, extractDir);

    onProgress?.(80);

    // 5. Copy files to game directory
    const targetPath = game.installPaths[gamePath.platform];
    const fullTargetPath = targetPath
      ? path.join(gamePath.path, targetPath)
      : gamePath.path;

    await copyDirectory(extractDir, fullTargetPath);

    onProgress?.(95);

    // 6. Cleanup
    await cleanup(archivePath, extractDir);

    onProgress?.(100);

    console.log(`Translation for ${gameId} installed successfully at ${fullTargetPath}`);
  } catch (error) {
    console.error('Installation error:', error);
    throw error;
  }
}

/**
 * Download file from URL with progress tracking
 */
export async function downloadFile(
  url: string,
  outputPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = net.request(url);
    const writeStream = fs.createWriteStream(outputPath);
    let downloadedBytes = 0;
    let totalBytes = 0;

    request.on('response', (response) => {
      // Handle redirects
      const statusCode = response.statusCode;
      if (
        statusCode === 301 ||
        statusCode === 302 ||
        statusCode === 307 ||
        statusCode === 308
      ) {
        const redirectUrl = response.headers.location as string;
        if (redirectUrl) {
          console.log(`Following redirect to: ${redirectUrl}`);
          writeStream.close();
          downloadFile(redirectUrl, outputPath, onProgress).then(resolve).catch(reject);
          return;
        }
      }

      if (statusCode !== 200) {
        writeStream.close();
        reject(new Error(`Failed to download: HTTP ${statusCode}`));
        return;
      }

      totalBytes = parseInt(response.headers['content-length'] as string, 10) || 0;

      response.on('data', (chunk) => {
        writeStream.write(chunk);
        downloadedBytes += chunk.length;

        if (onProgress && totalBytes > 0) {
          const progress = (downloadedBytes / totalBytes) * 100;
          onProgress(progress);
        }
      });

      response.on('end', () => {
        writeStream.end();
        resolve();
      });

      response.on('error', (error) => {
        writeStream.close();
        reject(error);
      });
    });

    request.on('error', (error) => {
      writeStream.close();
      reject(error);
    });

    writeStream.on('error', (error) => {
      writeStream.close();
      reject(error);
    });

    request.end();
  });
}

/**
 * Extract ZIP archive
 */
async function extractArchive(archivePath: string, extractPath: string): Promise<void> {
  try {
    await mkdir(extractPath, { recursive: true });

    const zip = new AdmZip(archivePath);
    zip.extractAllTo(extractPath, true);

    console.log(`Extracted archive to: ${extractPath}`);
  } catch (error) {
    throw new Error(
      `Помилка розпакування архіву: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectory(source: string, destination: string): Promise<void> {
  try {
    // Create destination directory
    await mkdir(destination, { recursive: true });

    // Read source directory
    const entries = await readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy subdirectory
        await copyDirectory(sourcePath, destPath);
      } else {
        // Copy file
        await fs.promises.copyFile(sourcePath, destPath);
      }
    }

    console.log(`Copied files from ${source} to ${destination}`);
  } catch (error) {
    throw new Error(
      `Помилка копіювання файлів: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Cleanup temporary files
 */
async function cleanup(archivePath: string, extractDir: string): Promise<void> {
  try {
    // Delete archive
    if (fs.existsSync(archivePath)) {
      await unlink(archivePath);
    }

    // Delete extracted files
    if (fs.existsSync(extractDir)) {
      await deleteDirectory(extractDir);
    }

    console.log('Cleanup completed');
  } catch (error) {
    console.warn('Cleanup warning:', error);
    // Don't throw error on cleanup failure
  }
}

/**
 * Delete directory recursively
 */
async function deleteDirectory(dirPath: string): Promise<void> {
  if (!fs.existsSync(dirPath)) return;

  const entries = await readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await deleteDirectory(fullPath);
    } else {
      await unlink(fullPath);
    }
  }

  await fs.promises.rmdir(dirPath);
}
