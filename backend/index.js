require('dotenv').config();

// const B2 = require('backblaze-b2');
const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const getAccessToken = require('./jwtAuth');

const app = express();
const PORT = process.env.PORT || 3000;


//const upload = multer({ dest: 'tmp/' }); // temp folder for uploads

console.log('=== ENV VARS ===');
// console.log('B2_KEY_ID:', process.env.B2_KEY_ID);
// console.log('B2_APPLICATION_KEY:', process.env.B2_APPLICATION_KEY ? 'SET' : 'MISSING');
// console.log('B2_BUCKET_ID:', process.env.B2_BUCKET_ID);
// console.log('CLOUDFLARE_SUBDOMAIN:', process.env.CLOUDFLARE_SUBDOMAIN);
console.log('DROPBOX_ACCESS_TOKEN:', process.env.DROPBOX_ACCESS_TOKEN);
console.log('================');

// Initialize B2 client
// const b2 = new B2({
//   applicationKeyId: process.env.B2_KEY_ID,       // from Backblaze
//   applicationKey: process.env.B2_APPLICATION_KEY         // from Backblaze
// });

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
    if (err) {
      return res.status(500).json({ error: 'Form parsing failed', details: err });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(
      'File received:',
      file.originalFilename,
      file.filepath,
      file.size
    );

    try {
      // Read file into buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      const dropboxPath = `/events/${Date.now()}_${file.originalFilename}`;

      /* 1️⃣ Upload file to Dropbox */
      const uploadResponse = await fetch(
        'https://content.dropboxapi.com/2/files/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
            'Dropbox-API-Arg': JSON.stringify({
              path: dropboxPath,
              mode: 'add',
              autorename: true,
              mute: false
            }),
            'Content-Type': 'application/octet-stream'
          },
          body: fileBuffer
        }
      );

      if (!uploadResponse.ok) {
        const text = await uploadResponse.text();
        throw new Error(`Dropbox upload failed: ${text}`);
      }

      const uploadedFile = await uploadResponse.json();

      /* 2️⃣ Create shared link */
      const linkResponse = await fetch(
        'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            path: uploadedFile.path_lower,
            settings: {
              requested_visibility: 'public'
            }
          })
        }
      );

      if (!linkResponse.ok) {
        const text = await linkResponse.text();
        throw new Error(`Create link failed: ${text}`);
      }

      const linkData = await linkResponse.json();

      // Convert Dropbox share link to direct image URL
      const publicUrl = linkData.url
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace('?dl=0', '');

      // Cleanup temp file
      fs.unlinkSync(file.filepath);

      console.log('File available at:', publicUrl);

      res.json({ url: publicUrl });

    } catch (err) {
      console.error('Dropbox upload error:', err);
      res.status(500).json({
        error: 'Upload failed',
        details: err.message
      });
    }
  });
});

// app.post('/uploadImageWrong', (req, res) => {
//   const form = new formidable.IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ error: 'Form parsing failed', details: err });
//     }

//     const file = files.file;
//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     console.log('File received:', file.originalFilename, file.filepath, file.size);

//     try {
//       const authResponse = await b2.authorize();
//       // Get upload URL for the bucket
//       const uploadUrlResponse = await b2.getUploadUrl({ bucketId: process.env.B2_BUCKET_ID });
//       const fileName = `events/${Date.now()}_${file.originalFilename}`;
//       const fileBuffer = fs.readFileSync(file.filepath);

//       const uploadResponse = await b2.uploadFile({
//         uploadUrl: uploadUrlResponse.data.uploadUrl,
//         uploadAuthToken: uploadUrlResponse.data.authorizationToken,
//         fileName,
//         data: fileBuffer
//       });

//       fs.unlinkSync(file.filepath);

//       const publicUrl = `${process.env.CLOUDFLARE_SUBDOMAIN}/${fileName}`;
//       //https://images.jimskg.com/events/1767746924560_thessivity_logo_white.png
//       //https://event-images.s3.eu-central-003.backblazeb2.com/events/1767746924560_thessivity_logo_white.png
//       console.log('File available at:', publicUrl);

//       res.json({ url: publicUrl });
//     } catch (err) {
//       console.error('B2 Upload error:', err);
//       res.status(500).json({ error: 'Upload failed', details: err.message });
//     }
//   });
// });

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

