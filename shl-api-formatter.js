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

const teams = {
  FHC: [],
  DIF: [],
  BIF: [],
  FBK: [],
  HV71: [],
  LHC: [],
  LHF: [],
  MIF: [],
  MIK: [],
  OHK: [],
  RBK: [],
  SAIK: [],
  TIK: [],
  VLH: [],
  LIF: [],
  IKO: [],
};
const winstreaks = apiResponse => apiResponse
  .filter(game => new Date() > new Date(game.start_date_time))
  .reduce((games, game) => ({
    ...games,
    [game.home_team_code]: game.home_team_result > game.away_team_result
      ? [...games[game.home_team_code], 1]
      : [...games[game.home_team_code], 0],
    [game.away_team_code]: game.away_team_result > game.home_team_result
      ? [...games[game.away_team_code], 1]
      : [...games[game.away_team_code], 0],
  }), teams);

module.exports = {
  standings,
  games,
  goalies,
  players,
  winstreaks,
};
