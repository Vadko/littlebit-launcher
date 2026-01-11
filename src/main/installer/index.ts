// Re-export all installer utilities

export { extractArchive } from './archive';
export {
  BACKUP_SUFFIX,
  backupFiles,
  cleanupEmptyDirectories,
  restoreBackupLegacy,
  restoreBackupNew,
} from './backup';
export {
  checkInstallation,
  deleteCachedInstallationInfo,
  getAllInstalledGameIds,
  getConflictingTranslation,
  getPreviousInstallPath,
  INSTALLATION_INFO_FILE,
  invalidateInstalledGameIdsCache,
  removeOrphanedInstallationMetadata,
  saveInstallationInfo,
} from './cache';
export { checkDiskSpace, parseSizeToBytes } from './disk';
export {
  abortCurrentDownload,
  clearPausedDownloadState,
  downloadFile,
  getDownloadAbortController,
  getPartialFilePath,
  getPausedDownloadState,
  pauseCurrentDownload,
  savePausedDownloadState,
  setCurrentDownloadState,
  setDownloadAbortController,
  updateCurrentDownloadedBytes,
} from './download';
export { ManualSelectionError, PausedSignal, RateLimitError } from './errors';
export { cleanupDownloadDir, copyDirectory, deleteDirectory, getAllFiles } from './files';
export { verifyFileHash } from './hash';
export {
  checkPlatformCompatibility,
  getInstallerFileName,
  getSteamAchievementsPath,
  hasExecutableInstaller,
  isExecutableInstaller,
  runInstaller,
} from './platform';
