import { release } from 'os';

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function getPlatform(): 'macos' | 'windows' | 'linux' | 'unknown' {
  if (isMacOS()) return 'macos';
  if (isWindows()) return 'windows';
  if (isLinux()) return 'linux';
  return 'unknown';
}

export function getMacOSVersion(): number {
  if (!isMacOS()) return 0;

  // Parse macOS version from os.release()
  // Example: "24.6.0" corresponds to macOS 15 (Sonoma)
  // macOS 26 would be "26.x.x"
  const releaseVersion = release();
  const majorVersion = parseInt(releaseVersion.split('.')[0], 10);

  return majorVersion;
}

export function supportsMacOSLiquidGlass(): boolean {
  if (!isMacOS()) return false;

  const macOSVersion = getMacOSVersion();
  // macOS 26 (Tahoe) or later supports liquid glass
  return macOSVersion >= 26;
}

export function shouldEnableLiquidGlass(userPreference: boolean = true): boolean {
  return supportsMacOSLiquidGlass() && userPreference;
}