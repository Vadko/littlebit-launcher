import { net } from 'electron';
import { Game } from '../shared/types';
import { GAMES_JSON_URL } from '../shared/constants';

export async function fetchGames(): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    const request = net.request(GAMES_JSON_URL);

    request.on('response', (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk.toString();
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.games || []);
        } catch (error) {
          console.error('Error parsing games JSON:', error);
          resolve([]);
        }
      });
    });

    request.on('error', (error) => {
      console.error('Error fetching games:', error);
      reject(error);
    });

    request.end();
  });
}
