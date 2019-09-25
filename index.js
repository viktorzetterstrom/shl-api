require('dotenv').config();
const express = require('express');
const redis = require('redis');
const { ShlConnection } = require('./shl-connection');
const { ShlClient } = require('./shl-client');

const redisClient = redis.createClient(6379);
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const port = process.env.PORT;
const cacheLifespan = process.env.CACHE_LIFESPAN;

const app = express();
const shl = new ShlClient(new ShlConnection(clientId, clientSecret));

app.get('/standings', (_, res) => {
  const standingsRedisKey = 'shl:standings';

  return redisClient.get(standingsRedisKey, (err, standings) => {
    if (err) return res.json({ error: err });
    if (standings) return res.json({ soure: 'cache', data: JSON.parse(standings) });

    return shl.season(2019).statistics.teams.standings()
      .then((apiResponse) => {
        redisClient.setex(standingsRedisKey, cacheLifespan, JSON.stringify(apiResponse));
        return res.json({ source: 'api', data: apiResponse });
      });
  });
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
