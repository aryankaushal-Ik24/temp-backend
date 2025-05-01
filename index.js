require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

app.get('/auth/callback', async (req, res) => {
  const { code, shop } = req.query;

  try {
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: API_KEY,
      client_secret: API_SECRET,
      code,
    });

    const { access_token } = response.data;
    console.log(access_token);

    // Save access_token securely (e.g., database)

    return res.json({ "accesstoken":access_token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Token exchange failed',err.message);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));