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

    const lang = req.query.lang || 'gr';
    const sfResponse = await fetch(
      `${tokenData.instance_url}/services/apexrest/getData?lang=${lang}`,
      //`${tokenData.instance_url}/services/data/v58.0/query?q=SELECT+Id,Name+FROM+Contact+LIMIT+10`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
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

app.get('/getGoogleSheetData', async (req, res) => {
  try {
    const apiKey = process.env.GD_API_KEY;
    const sheetId = process.env.GD_SHEET_ID;

    const { gid } = req.query; // sheet name
    if (!gid) {
      return res.status(400).json({ error: 'Missing "gid" query parameter' });
    }

    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${gid}?key=${apiKey}`;
    const response = await fetch(sheetUrl);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Google Sheets fetch failed: ${text}`);
    }

    const json = await response.json();

    res.json(json);
  } catch (err) {
    console.error('Google Sheets error:', err.message);
    res.status(500).json({ error: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

