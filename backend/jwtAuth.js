const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

async function getAccessToken() {
  const payload = {
    iss: process.env.SF_CLIENT_ID,       // Consumer Key
    sub: process.env.SF_USERNAME,        // Salesforce username
    aud: process.env.SF_LOGIN_URL,       // https://login.salesforce.com
    exp: Math.floor(Date.now() / 1000) + 180
  };

  const privateKey = process.env.SF_PRIVATE_KEY.replace(/\\n/g, '\n');

  const signedJwt = jwt.sign(payload, privateKey, {
    algorithm: 'RS256'
  });

  const params = new URLSearchParams();
  params.append(
    'grant_type',
    'urn:ietf:params:oauth:grant-type:jwt-bearer'
  );
  params.append('assertion', signedJwt);

  const response = await fetch(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    {
      method: 'POST',
      body: params
    }
  );

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

module.exports = getAccessToken;
