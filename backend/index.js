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

// Example API: getData (auto-called on page load)
app.get('/getData', async (req, res) => {
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

