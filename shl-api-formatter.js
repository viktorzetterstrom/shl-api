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
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const gameDate = new Date(game.start_date_time);
    return twoWeeksAgo < gameDate && gameDate < oneWeekAway;
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
  const teamWinstreaks = { ...teamInfo };
  Object.keys(teamInfo).forEach((teamCode) => {
    teamWinstreaks[teamCode].streaks = {
      both: 0,
      home: 0,
      away: 0,
    };
  });

  const hasLostHome = {};
  const hasLostAway = {};

  playedGames.forEach((game) => {
    const homeCode = game.home_team_code;
    const awayCode = game.away_team_code;
    const homeResult = game.home_team_result;
    const awayResult = game.away_team_result;

    if (homeResult > awayResult) {
      hasLostAway[awayCode] = true;

      teamWinstreaks[homeCode].streaks = {
        ...teamWinstreaks[homeCode].streaks,
        both: !hasLostHome[homeCode] && !hasLostAway[homeCode]
          ? teamWinstreaks[homeCode].streaks.both += 1
          : teamWinstreaks[homeCode].streaks.both,
        home: !hasLostHome[homeCode]
          ? teamWinstreaks[homeCode].streaks.home += 1
          : teamWinstreaks[homeCode].streaks.home,
      };
    } else {
      hasLostHome[homeCode] = true;

      teamWinstreaks[awayCode].streaks = {
        ...teamWinstreaks[awayCode].streaks,
        both: !hasLostHome[awayCode] && !hasLostAway[awayCode]
          ? teamWinstreaks[awayCode].streaks.both += 1
          : teamWinstreaks[awayCode].streaks.both,
        away: !hasLostAway[awayCode]
          ? teamWinstreaks[awayCode].streaks.away += 1
          : teamWinstreaks[awayCode].streaks.away,
      };
    }
  });
  return Object.values(teamWinstreaks).sort((a, b) => b.streaks.both - a.streaks.both);
};

module.exports = {
  standings,
  games,
  goalies,
  players,
  winstreaks,
};
