const teamInfo = require('./team-info.json');

const standings = apiResponse => apiResponse.map(team => ({
  ...team,
  logo: teamInfo[team.team.id].logo,
  name: teamInfo[team.team.id].name,
}));

const games = apiResponse => apiResponse
  .map(game => ({
    ...game,
    start_date_time: new Date(game.start_date_time),
  }))
  .filter((game) => {
    const oneWeekAway = new Date();
    oneWeekAway.setDate(oneWeekAway.getDate() + 7);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const gameDate = new Date(game.start_date_time);
    return oneWeekAgo < gameDate && gameDate < oneWeekAway;
  })
  .map(game => ({
    ...game,
    home_team_logo: teamInfo[game.home_team_code].logo,
    away_team_logo: teamInfo[game.away_team_code].logo,
  }));

const goalies = apiResponse => apiResponse
  .map(goalie => ({
    ...goalie,
    info: {
      ...goalie.info,
      team: {
        ...goalie.info.team,
        logo: teamInfo[goalie.info.team.id].logo,
        name: teamInfo[goalie.info.team.id].name,
      },
    },
  }));

const players = apiResponse => apiResponse
  .map(player => ({
    ...player,
    info: {
      ...player.info,
      team: {
        ...player.info.team,
        logo: teamInfo[player.info.team.id].logo,
        name: teamInfo[player.info.team.id].name,
      },
    },
  }));

const winstreaks = (apiResponse) => {
  const playedGames = apiResponse.filter(game => new Date() > new Date(game.start_date_time));
  const teamWinstreaks = {};
  const hasLost = [];
  playedGames.forEach((game) => {
    const winner = game.home_team_result > game.away_team_result
      ? game.home_team_code
      : game.away_team_code;
    const loser = game.home_team_result < game.away_team_result
      ? game.home_team_code
      : game.away_team_code;

    hasLost.push(loser);
    if (!hasLost.includes(winner)) {
      teamWinstreaks[winner] = teamWinstreaks[winner] !== undefined
        ? {
          ...teamWinstreaks[winner],
          winstreak: teamWinstreaks[winner].winstreak + 1,
        }
        : {
          name: teamInfo[winner].name,
          logo: teamInfo[winner].logo,
          winstreak: 1,
        };
    }
  });
  return Object.values(teamWinstreaks).sort((a, b) => b.winstreak - a.winstreak);
};

module.exports = {
  standings,
  games,
  goalies,
  players,
  winstreaks,
};
