require('dotenv').config();

const B2 = require('backblaze-b2');
const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const getAccessToken = require('./jwtAuth');

const app = express();
const PORT = process.env.PORT || 3000;


//const upload = multer({ dest: 'tmp/' }); // temp folder for uploads

// Initialize B2 client
const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,       // from Backblaze
  applicationKey: process.env.B2_APPLICATION_KEY         // from Backblaze
});

// Allow frontend calls
app.use(cors());

app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // optional: parse form bodies

// Health check
app.get('/', (req, res) => {
  res.send('Salesforce backend is running');
});

const formidable = require('formidable');

app.post('/uploadImage', (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing failed' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      await b2.authorize();

      const fileName = `events/${Date.now()}_${file.originalFilename}`;
      const fileBuffer = fs.readFileSync(file.filepath);

      const uploadResponse = await b2.uploadFile({
        bucketId: process.env.B2_BUCKET_ID,
        fileName,
        data: fileBuffer
      });

      // Remove temp file
      fs.unlinkSync(file.filepath);

      // Cloudflare public URL
      const publicUrl = `${process.env.CLOUDFLARE_SUBDOMAIN}/${fileName}`;

      res.json({ url: publicUrl });
    } catch (err) {
      console.error('B2 Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
});


// Example API: getData (auto-called on page load)
app.get('/getData', async (req, res) => {
  try {
    const tokenData = await getAccessToken();

    const lang = req.query.lang || 'gr';
    const id = req.query.id; // optional parameter

    let url = `${tokenData.instance_url}/services/apexrest/getData?lang=${lang}`;
    if (id) {
      url += `&id=${encodeURIComponent(id)}`;
    }

    const sfResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await sfResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Salesforce error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.get('/getInfo', async (req, res) => {
  try {
    const tokenData = await getAccessToken();

    const lang = req.query.lang || 'gr';
    const page = req.query.page; // optional parameter

    let url = `${tokenData.instance_url}/services/apexrest/getInfo?lang=${lang}&page=${page}`;

    const sfResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await sfResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Salesforce error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});

app.post('/createEvent', async (req, res) => {
  try {
    const tokenData = await getAccessToken();
    const eventData = req.body;

    const url = `${tokenData.instance_url}/services/apexrest/createEvent`;

    const sfResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });

    const result = await sfResponse.json();

    res.status(sfResponse.status).json(result);

  } catch (err) {
    console.error('Salesforce error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
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
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

