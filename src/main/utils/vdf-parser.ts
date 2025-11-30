/**
 * VDF (Valve Data Format) Parser
 * Based on Steam's KeyValues format
 */

export interface VDFValue {
  [key: string]: string | VDFValue;
}

/**
 * Parse VDF content into a JavaScript object
 */
export function parseVDF(content: string): VDFValue {
  const lines = content.split('\n').map(line => line.trim());
  const root: VDFValue = {};
  const stack: Array<{ obj: VDFValue; key?: string }> = [{ obj: root }];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip empty lines and comments
    if (!line || line.startsWith('//')) continue;

    // Handle opening brace
    if (line === '{') {
      continue;
    }

    // Handle closing brace
    if (line === '}') {
      stack.pop();
      continue;
    }

    // Parse key-value pairs
    const match = line.match(/^"([^"]+)"\s+"([^"]*)"$/);
    if (match) {
      const [, key, value] = match;
      const current = stack[stack.length - 1];
      current.obj[key] = value;
      continue;
    }

    // Parse key (for nested objects)
    const keyMatch = line.match(/^"([^"]+)"$/);
    if (keyMatch) {
      const key = keyMatch[1];
      const current = stack[stack.length - 1];
      const newObj: VDFValue = {};
      current.obj[key] = newObj;
      stack.push({ obj: newObj, key });
      continue;
    }
  }

  return root;
}

/**
 * Get a nested value from VDF object by path
 */
export function getVDFValue(obj: VDFValue, path: string[]): string | VDFValue | undefined {
  let current: string | VDFValue = obj;

  for (const key of path) {
    if (typeof current === 'string') return undefined;
    current = current[key];
    if (current === undefined) return undefined;
  }

  return current;
}

/**
 * Parse Steam libraryfolders.vdf file
 */
export function parseLibraryFolders(content: string): string[] {
  const parsed = parseVDF(content);
  const libraries: string[] = [];

  // The VDF structure is: "libraryfolders" -> { "0": {...}, "1": {...}, ... }
  const libraryFolders = parsed['libraryfolders'] as VDFValue | undefined;
  if (!libraryFolders || typeof libraryFolders === 'string') return libraries;

  // Iterate through numbered entries
  for (const key in libraryFolders) {
    const entry = libraryFolders[key];
    if (typeof entry === 'object' && entry.path && typeof entry.path === 'string') {
      libraries.push(entry.path);
    }
  }

  return libraries;
}

/**
 * Parse Steam appmanifest file
 */
export interface AppManifest {
  appid: string;
  name: string;
  installdir: string;
  StateFlags?: string;
  LastUpdated?: string;
}

export function parseAppManifest(content: string): AppManifest | null {
  try {
    const parsed = parseVDF(content);
    const appState = parsed['AppState'] as VDFValue | undefined;

    if (!appState || typeof appState === 'string') return null;

    return {
      appid: (appState.appid as string) || '',
      name: (appState.name as string) || '',
      installdir: (appState.installdir as string) || '',
      StateFlags: appState.StateFlags as string,
      LastUpdated: appState.LastUpdated as string,
    };
  } catch (error) {
    console.error('[VDFParser] Error parsing appmanifest:', error);
    return null;
  }
}
