import { app } from 'electron';
import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

let saveLogsEnabled = false;
let logFilePath: string | null = null;

function getLogFilePath(): string {
  if (!logFilePath) {
    const logsDir = join(app.getPath('userData'), 'logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    const date = new Date().toISOString().split('T')[0];
    logFilePath = join(logsDir, `littlebit-${date}.log`);
  }
  return logFilePath;
}

function formatLogMessage(level: string, message: string, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.length > 0 ? ' ' + args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  }).join(' ') : '';
  return `[${timestamp}] [${level}] ${message}${formattedArgs}\n`;
}

function writeToFile(logMessage: string): void {
  if (!saveLogsEnabled) return;

  try {
    const filePath = getLogFilePath();
    appendFileSync(filePath, logMessage);
  } catch (error) {
    // Silent fail - don't want logging to break the app
    console.error('[Logger] Failed to write to log file:', error);
  }
}

export function setSaveLogsEnabled(enabled: boolean): void {
  saveLogsEnabled = enabled;

  if (enabled) {
    // Write header to log file when logging is enabled
    const filePath = getLogFilePath();
    if (!existsSync(filePath)) {
      writeFileSync(filePath, `=== LittleBit Launcher Logs ===\nStarted: ${new Date().toISOString()}\n\n`);
    }
  }
}

export function isSaveLogsEnabled(): boolean {
  return saveLogsEnabled;
}

// Override console methods to also write to file
const originalConsoleLog = console.log.bind(console);
const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);
const originalConsoleInfo = console.info.bind(console);

export function initLogger(): void {
  console.log = (message: string, ...args: unknown[]) => {
    originalConsoleLog(message, ...args);
    writeToFile(formatLogMessage('LOG', message, ...args));
  };

  console.error = (message: string, ...args: unknown[]) => {
    originalConsoleError(message, ...args);
    writeToFile(formatLogMessage('ERROR', message, ...args));
  };

  console.warn = (message: string, ...args: unknown[]) => {
    originalConsoleWarn(message, ...args);
    writeToFile(formatLogMessage('WARN', message, ...args));
  };

  console.info = (message: string, ...args: unknown[]) => {
    originalConsoleInfo(message, ...args);
    writeToFile(formatLogMessage('INFO', message, ...args));
  };
}

export function getLogFileDirectory(): string {
  return join(app.getPath('userData'), 'logs');
}
