const qs = require('querystring');
const fetch = require('node-fetch');

const baseUrl = 'https://openapi.shl.se';
const auth = '/oauth2/token';

class ShlConnection {
  constructor(clientId, clientSecret) {
    this.id = clientId;
    this.secret = clientSecret;
  }

  isConnected() {
    return
  }

  async connect() {
    const url = baseUrl + auth;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.encode({
        client_id: this.id,
        client_secret: this.secret,
        grant_type: 'client_credentials',
      }),
    }).then(res => res.json());

    this.accessToken = res.access_token
    this.expires = new Date();
    this.expires = this.expires.setSeconds(this.expires.getSeconds() + res.expires_in);
  }

  get(queryString) {
    return fetch(baseUrl + queryString, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    }).then(res => res.json());
  }
}

module.exports = { ShlConnection };
