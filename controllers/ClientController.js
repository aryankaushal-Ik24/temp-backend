const axios = require('axios');
const Client = require('../models/Client');

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const FRONTEND_URL = process.env.FORNTEND_URI



const handleAuthCallback = async (req, res) => {
    const { code, shop } = req.query;

    if (!code || !shop) {
        return res.status(400).send('Missing code or shop parameter.');
    }

    try {
        
        const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
            client_id: API_KEY,
            client_secret: API_SECRET,
            code,
        });

        const accessToken = tokenResponse.data.access_token;
        if(!accessToken){
            return res.status(403).json({
                success:false,
                message:"access not found please try again"
            })
        }
        const createClient = await Client.create({
            shopName:shop,
            accessToken:accessToken,
        })
        if(!createClient){
            return res.status(401).json({
                success:false,
                message:"Can't create client please try again"
            })
        }
        const redirectUrl = FRONTEND_URL;
        return res.redirect(redirectUrl);

    } catch (error) {
        console.error('Error during auth callback:', error?.response?.data || error.message);
        return res.status(500).send('Token exchange or product fetch failed.');
    }
}

module.exports = {
    handleAuthCallback,
};