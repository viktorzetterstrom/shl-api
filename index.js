require('dotenv').config();
const express = require('express');
const { ShlConnection } = require('./shl-connection');
const { ShlClient } = require('./shl-client');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const app = express();
const shl = new ShlClient(new ShlConnection(clientId, clientSecret));

app.get('/standings', async (req, res) => {
  const result = await shl.season(2019).statistics.teams.standings();
  res.send(result);
});

app.listen(4000, () => {
  console.log('SHL-api listening on port 4000');
});
