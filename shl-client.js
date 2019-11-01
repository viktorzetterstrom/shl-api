

class ShlClient {
  constructor(connection) {
    this.connection = connection;
  }

  season(year) {
    const base = `/seasons/${year}`;
    return {
      games: () => this.connection.get(`${base}/games`),
      game: gameId => this.connection.get(`${base}/games/${gameId}`),
      statistics: {
        goalkeepers: () => this.connection.get(`${base}/statistics/goalkeepers?sort=savesPercent`),
        players: () => this.connection.get(`${base}/statistics/players?sort=points`),
        teams: {
          standings: () => this.connection.get(`${base}/statistics/teams/standings`),
        },
      },
    };
  }

  teams() {
    return this.connection.get('/teams');
  }

  team(teamId) {
    return this.connection.get(`/teams/${teamId}`);
  }

  videos() {
    return this.connection.get('/videos');
  }

  articles() {
    return this.connection.get('articles');
  }
}

module.exports.ShlClient = ShlClient;
