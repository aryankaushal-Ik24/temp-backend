const axios = require('axios');
// Environment variables for API credentials
API_KEY = 'd58d81c5f8fa4c477cda2118c4ea0c2d';
API_SECRET = '84dba585c5561f7c46b348c0598c054a';

// Controller for handling Shopify OAuth callback
const handleAuthCallback = async (req, res) => {
    const { code, shop } = req.query;

    if (!code || !shop) {
        return res.status(400).send('Missing code or shop parameter.');
    }

    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
            client_id: API_KEY,
            client_secret: API_SECRET,
            code,
        });

        const accessToken = tokenResponse.data.access_token;
        console.log('Access Token:', accessToken);
        return res.status(201).json({
            shopName:shop,
            accessToken:accessToken
        })

    } catch (error) {
        console.error('Error during auth callback:', error?.response?.data || error.message);
        return res.status(500).send('Token exchange or product fetch failed.');
    }
};

module.exports = {
    handleAuthCallback,
};