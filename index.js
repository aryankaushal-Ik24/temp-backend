require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'd58d81c5f8fa4c477cda2118c4ea0c2d';
const API_SECRET = '84dba585c5561f7c46b348c0598c054a';

app.get('/auth/callback', async (req, res) => {
  const { code, shop } = req.query;

  try {
    console.log("code",code);
    console.log("shop",shop);
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