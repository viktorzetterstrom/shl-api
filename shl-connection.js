const qs = require('querystring');
const fetch = require('node-fetch');

const baseUrl = 'https://openapi.shl.se';
const auth = '/oauth2/token';

class ShlConnection {
  constructor(clientId, clientSecret) {
    this.id = clientId;
    this.secret = clientSecret;
    this.connect();
  }

  async connect() {
    const url = baseUrl + auth;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.encode({
        client_id: this.id,
        client_secret: this.secret,
        grant_type: 'client_credentials',
      }),
    }).then(res => res.json());

    this.accessToken = response.access_token;
    this.expires = new Date();
    this.expires = this.expires.setSeconds(this.expires.getSeconds() + response.expires_in);
  }

  async get(queryString) {
    if (new Date() > this.expires) await this.connect();
    return fetch(baseUrl + queryString, {
      headers: {
        authorization: `Bearer ${this.accessToken}`,
      },
    }).then(res => res.json());
  }
}

module.exports.ShlConnection = ShlConnection;
