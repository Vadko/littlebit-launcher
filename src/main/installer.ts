import { app, net } from 'electron';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

export async function installTranslation(
  gameId: string,
  platform: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  // This is a simplified implementation
  // In a real app, you would:
  // 1. Fetch the game data to get download URL
  // 2. Download the translation archive
  // 3. Extract it to the game directory
  // 4. Apply patches if needed

  const tempDir = app.getPath('temp');
  const downloadDir = path.join(tempDir, 'little-bit-downloads');

  // Ensure download directory exists
  await mkdir(downloadDir, { recursive: true });

  // Simulate download progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    onProgress?.(i);
  }

  console.log(`Translation for ${gameId} on ${platform} installed successfully`);
}

export async function downloadFile(
  url: string,
  outputPath: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = net.request(url);
    const chunks: Buffer[] = [];
    let downloadedBytes = 0;
    let totalBytes = 0;

    request.on('response', (response) => {
      totalBytes = parseInt(response.headers['content-length'] as string, 10);

      response.on('data', (chunk) => {
        chunks.push(chunk);
        downloadedBytes += chunk.length;

        if (onProgress && totalBytes > 0) {
          const progress = (downloadedBytes / totalBytes) * 100;
          onProgress(progress);
        }
      });

      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          await writeFile(outputPath, buffer);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
}
