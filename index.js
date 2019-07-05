require('dotenv').config();
const { Connection } = require('./shl-connection');
const { Client } = require('./shl-client');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const connect = () => new Client(new Connection(clientId, clientSecret));

module.exports = { connect };
