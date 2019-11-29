require('dotenv').config();
const express = require('express');
const redis = require('redis');
const formatter = require('./shl-api-formatter');
const { ShlConnection } = require('./shl-connection');
const { ShlClient } = require('./shl-client');

const redisClient = redis.createClient(6379);
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const cacheLifespan = process.env.CACHE_LIFESPAN;

const app = express();
const shl = new ShlClient(new ShlConnection(clientId, clientSecret));
app.use(require('helmet')());
app.use(require('cors')());

app.get('/standings', (_, res) => {
  const standingsRedisKey = 'shl:standings';

  return redisClient.get(standingsRedisKey, (err, standings) => {
    if (err) return res.json({ error: err });
    if (standings) return res.json({ soure: 'cache', data: JSON.parse(standings) });

    return shl.season(2019).statistics.teams.standings()
      .then((apiResponse) => {
        const formatedResponse = formatter.standings(apiResponse);
        redisClient.setex(
          standingsRedisKey,
          cacheLifespan,
          JSON.stringify(formatedResponse),
        );
        return res.json({ source: 'api', data: formatedResponse });
      });
  });
});

app.get('/games', (_, res) => {
  const gamesRedisKey = 'shl:games';

  return redisClient.get(gamesRedisKey, (err, games) => {
    if (err) return res.json({ error: err });
    if (games) {
      return res.json({ soure: 'cache', data: JSON.parse(games) });
    }
    return shl.season(2019).games()
      .then((apiResponse) => {
        const formatedResponse = formatter.games(apiResponse);
        redisClient.setex(
          gamesRedisKey,
          cacheLifespan,
          JSON.stringify(formatedResponse),
        );
        return res.json({ source: 'api', data: formatedResponse });
      });
  });
});

app.get('/goalies', (_, res) => {
  const goaliesRedisKey = 'shl:goalies';

  return redisClient.get(goaliesRedisKey, (err, standings) => {
    if (err) return res.json({ error: err });
    if (standings) {
      return res.json({ soure: 'cache', data: JSON.parse(standings) });
    }
    return shl.season(2019).statistics.goalkeepers()
      .then((apiResponse) => {
        const formatedResponse = formatter.goalies(apiResponse);
        redisClient.setex(
          goaliesRedisKey,
          cacheLifespan,
          JSON.stringify(formatedResponse),
        );
        return res.json({ source: 'api', data: formatedResponse });
      });
  });
});

app.get('/players', (_, res) => {
  const playersRedisKey = 'shl:players';

  return redisClient.get(playersRedisKey, (err, players) => {
    if (err) return res.json({ error: err });
    if (players) {
      return res.json({ soure: 'cache', data: JSON.parse(players) });
    }
    return shl.season(2019).statistics.players()
      .then((apiResponse) => {
        const formatedResponse = formatter.goalies(apiResponse);
        redisClient.setex(
          playersRedisKey,
          cacheLifespan,
          JSON.stringify(formatedResponse),
        );
        return res.json({ source: 'api', data: formatedResponse });
      });
  });
});

app.get('/winstreaks', (req, res) => {
  const winstreaksRedisKey = 'shl:winstreaks';

  return redisClient.get(winstreaksRedisKey, (err, winstreaks) => {
    if (err) return res.json({ error: err });
    if (winstreaks) {
      return res.json({ soure: 'cache', data: JSON.parse(winstreaks) });
    }
    return shl.season(2019).games()
      .then((apiResponse) => {
        const formatedResponse = formatter.winstreaks(apiResponse);
        redisClient.setex(
          winstreaksRedisKey,
          cacheLifespan,
          JSON.stringify(formatedResponse),
        );
        return res.json({ source: 'api', data: formatedResponse });
      });
  });
});

app.listen(port);
