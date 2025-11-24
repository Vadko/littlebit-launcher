import { net } from 'electron';
import { Game } from '../shared/types';
import { GAMES_JSON_URL } from '../shared/constants';
import path from 'path';
import fs from 'fs';

export async function fetchGames(): Promise<Game[]> {
  return new Promise((resolve) => {
    // Try to fetch from GitHub first
    const request = net.request(GAMES_JSON_URL);

    request.on('response', (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk.toString();
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const games = parsed.games || [];
          console.log(`[API] Fetched ${games.length} games from GitHub`);
          resolve(games);
        } catch (error) {
          console.error('[API] Error parsing games JSON from GitHub:', error);
          // Fallback to local file
          resolve(fetchGamesFromLocal());
        }
      });
    });

    request.on('error', (error) => {
      console.error('[API] Error fetching games from GitHub:', error);
      // Fallback to local file
      resolve(fetchGamesFromLocal());
    });

    request.end();
  });
}

// Fallback function to read from local file
function fetchGamesFromLocal(): Game[] {
  try {
    const isDev = process.env.NODE_ENV === 'development';

    let gamesJsonPath: string;
    if (isDev) {
      // In development, read from public folder
      gamesJsonPath = path.join(process.cwd(), 'public', 'translations', 'games.json');
    } else {
      // In production, read from resources
      gamesJsonPath = path.join(process.resourcesPath, 'translations', 'games.json');
    }

    const data = fs.readFileSync(gamesJsonPath, 'utf-8');
    const parsed = JSON.parse(data);
    const games = parsed.games || [];
    console.log(`[API] Loaded ${games.length} games from local file`);
    return games;
  } catch (error) {
    console.error('[API] Error reading local games JSON:', error);
    return [];
  }
}
