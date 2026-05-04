// netlify/functions/search-logos.js
// Searches ESPN API for sports team logos

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const query = event.queryStringParameters?.q?.toLowerCase();
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
  }

  const leagues = [
    { key: 'nfl',     url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams' },
    { key: 'nba',     url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams' },
    { key: 'mlb',     url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams' },
    { key: 'nhl',     url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams' },
    { key: 'mls',     url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams' },
    { key: 'ncaafb',  url: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200' },
    { key: 'ncaabb',  url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?limit=200' },
  ];

  try {
    const responses = await Promise.all(
      leagues.map(l =>
        fetch(l.url)
          .then(r => r.json())
          .then(d => ({ data: d, league: l.key }))
          .catch(() => null)
      )
    );

    let allTeams = [];

    responses.forEach(res => {
      if (!res) return;
      const { data, league } = res;
      const teams =
        data.sports?.[0]?.leagues?.[0]?.teams ||
        data.teams ||
        [];

      teams.forEach(t => {
        const team = t.team || t;
        if (!team.displayName) return;

        const logos = (team.logos || []).map(l => l.href);

        // fallback logo if none from API
        if (logos.length === 0 && team.abbreviation) {
          logos.push(`https://a.espncdn.com/i/teamlogos/${league}/500/${team.abbreviation.toLowerCase()}.png`);
        }

        allTeams.push({
          name: team.displayName,
          abbr: team.abbreviation || '',
          league: league.toUpperCase(),
          logos,
        });
      });
    });

    // Filter by query
    const matches = allTeams
      .filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.abbr.toLowerCase().includes(query)
      )
      .slice(0, 12);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ teams: matches }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
