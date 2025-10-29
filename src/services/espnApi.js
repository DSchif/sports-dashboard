// ESPN API Service
// Free API endpoint for live sports scores

const SPORTS_CONFIG = [
  { name: 'NFL', sport: 'football', league: 'nfl', icon: '🏈' },
  { name: 'NBA', sport: 'basketball', league: 'nba', icon: '🏀' },
  { name: 'MLB', sport: 'baseball', league: 'mlb', icon: '⚾' },
  { name: 'NHL', sport: 'hockey', league: 'nhl', icon: '🏒' },
  { name: 'MLS', sport: 'soccer', league: 'usa.1', icon: '⚽' },
  { name: 'Premier League', sport: 'soccer', league: 'eng.1', icon: '⚽' },
];

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';

export async function fetchLiveGames() {
  try {
    const promises = SPORTS_CONFIG.map(async (config) => {
      try {
        const url = `${BASE_URL}/${config.sport}/${config.league}/scoreboard`;
        const response = await fetch(url);

        if (!response.ok) {
          console.warn(`Failed to fetch ${config.name}:`, response.status);
          return [];
        }

        const data = await response.json();

        if (!data.events || data.events.length === 0) {
          return [];
        }

        // Filter for live games and games starting within next hour
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

        const relevantGames = data.events.filter((event) => {
          const gameDate = new Date(event.date);
          const isLive = event.status.type.state === 'in';
          const isUpcoming = gameDate <= oneHourFromNow && gameDate > now;
          return isLive || isUpcoming;
        });

        return relevantGames.map((event) => ({
          id: event.id,
          sport: config.name,
          sportIcon: config.icon,
          homeTeam: {
            name: event.competitions[0].competitors.find(c => c.homeAway === 'home')?.team.displayName || 'Home',
            logo: event.competitions[0].competitors.find(c => c.homeAway === 'home')?.team.logo || '',
            score: event.competitions[0].competitors.find(c => c.homeAway === 'home')?.score || '0',
            abbreviation: event.competitions[0].competitors.find(c => c.homeAway === 'home')?.team.abbreviation || '',
          },
          awayTeam: {
            name: event.competitions[0].competitors.find(c => c.homeAway === 'away')?.team.displayName || 'Away',
            logo: event.competitions[0].competitors.find(c => c.homeAway === 'away')?.team.logo || '',
            score: event.competitions[0].competitors.find(c => c.homeAway === 'away')?.score || '0',
            abbreviation: event.competitions[0].competitors.find(c => c.homeAway === 'away')?.team.abbreviation || '',
          },
          status: event.status.type.description,
          statusDetail: event.status.type.detail,
          isLive: event.status.type.state === 'in',
          startTime: new Date(event.date),
        }));
      } catch (error) {
        console.error(`Error fetching ${config.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allGames = results.flat();

    // Sort: live games first, then by start time
    return allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return a.startTime - b.startTime;
    });
  } catch (error) {
    console.error('Error fetching live games:', error);
    return [];
  }
}

export async function fetchGameById(gameId) {
  try {
    // This is a simplified version - in production you'd need to know which sport/league
    // For now, we'll rely on the cached data from fetchLiveGames
    const allGames = await fetchLiveGames();
    return allGames.find(game => game.id === gameId);
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    return null;
  }
}
