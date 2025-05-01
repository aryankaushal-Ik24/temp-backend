// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const app = express();

// const API_KEY = 'd58d81c5f8fa4c477cda2118c4ea0c2d';
// const API_SECRET = '84dba585c5561f7c46b348c0598c054a';

// app.get('/auth/callback', async (req, res) => {
//   const { code, shop } = req.query;

//   try {
//     console.log("code",code);
//     console.log("shop",shop);
//     const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
//       client_id: API_KEY,
//       client_secret: API_SECRET,
//       code,
//     });

//     const { access_token } = response.data;
//     console.log(access_token);

//     // Save access_token securely (e.g., database)

//     return res.json({ "accesstoken":access_token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Token exchange failed',err.message);
//   }
// });

// app.listen(3000, () => console.log('Server running on port 3000'));


require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'd58d81c5f8fa4c477cda2118c4ea0c2d';
const API_SECRET = '84dba585c5561f7c46b348c0598c054a';

app.get('/auth/callback', async (req, res) => {
  const { code, shop } = req.query;

  if (!code || !shop) {
    return res.status(400).send('Missing code or shop parameter.');
  }

  try {
    // Step 1: Get Access Token
    const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: API_KEY,
      client_secret: API_SECRET,
      code,
    });

    const access_token = tokenRes.data.access_token;
    console.log('Access Token:', access_token);

    // Step 2: Use token to get products
    const productRes = await axios.get(`https://${shop}/admin/api/2024-01/products.json`, {
      headers: {
        'X-Shopify-Access-Token': access_token,
        'Content-Type': 'application/json'
      }
    });

    const products = productRes.data.products;
    console.log("products: ",products)

    // Option A: Send product data back as JSON
    return res.json({ products });

    // Option B (Alternative): Redirect to your frontend
    // res.redirect(`https://your-frontend-url.com/products?shop=${shop}`);
    
  } catch (err) {
    console.error('Error during auth callback:', err?.response?.data || err.message);
    res.status(500).send('Token exchange or product fetch failed.');
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
