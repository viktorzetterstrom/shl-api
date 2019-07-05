require('dotenv').config();
const { ShlConnection } = require('./shl-service');


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const test = new ShlConnection(clientId, clientSecret);

const testfn = async () => {
  await test.connect();
  const result = await test.get('/seasons/2018/statistics/goalkeepers');
  console.log(result);
};

testfn();
