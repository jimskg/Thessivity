// require('dotenv').config();
// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');

// const app = express();
// app.use(cors()); // allow frontend requests
// const PORT = process.env.PORT || 3000;

// // Get Salesforce access token
// async function getAccessToken() {
//   const params = new URLSearchParams();
//   params.append('grant_type', 'password');
//   params.append('client_id', process.env.SF_CLIENT_ID);
//   params.append('client_secret', process.env.SF_CLIENT_SECRET);
//   params.append('username', process.env.SF_USERNAME);
//   params.append('password', process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN);

//   const response = await fetch(
//     'https://login.salesforce.com/services/oauth2/token',
//     { method: 'POST', body: params }
//   );
//   return response.json();
// }

// // Endpoint to fetch first 10 Accounts
// app.get('/accounts', async (req, res) => {
//   try {
//     const tokenData = await getAccessToken();
//     if (!tokenData.access_token) return res.status(500).json({ error: 'Auth Failed', details: tokenData });

//     const sfResponse = await fetch(
//       `${tokenData.instance_url}/services/data/v58.0/query?q=SELECT+Id,Name+FROM+Account+LIMIT+10`,
//       { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
//     );

//     const data = await sfResponse.json();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const getAccessToken = require('./jwtAuth');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend calls
app.use(cors());

// Health check
app.get('/', (req, res) => {
  res.send('Salesforce backend is running');
});

// Example API: Accounts (auto-called on page load)
app.get('/accounts', async (req, res) => {
  try {
    const tokenData = await getAccessToken();

    const sfResponse = await fetch(
      `${tokenData.instance_url}/services/data/v58.0/query?q=SELECT+Id,Name+FROM+Account+LIMIT+10`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    );

    const data = await sfResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Salesforce error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Example API: Contacts (button click)
app.get('/contacts', async (req, res) => {
  try {
    const tokenData = await getAccessToken();

    const sfResponse = await fetch(
      `${tokenData.instance_url}/services/data/v58.0/query?q=SELECT+Id,Name+FROM+Contact+LIMIT+10`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    );

    const data = await sfResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Salesforce error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

