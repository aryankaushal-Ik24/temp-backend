const axios = require('axios');
const Client = require('../models/Client');

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL



const handleAuthCallback = async (req, res) => {
    const { code, shop } = req.query;
    console.log("Redirecting to:", FRONTEND_URL);
    if (!code || !shop) {
        return res.status(400).send('Missing code or shop parameter.');
    }

    try {
        const client = await Client.findOne({ shop });
        if(client){
            return res.redirect(FRONTEND_URL);
        }
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
        return res.redirect(FRONTEND_URL);

    } catch (error) {
        console.error('Error during auth callback:', error?.response?.data || error.message);
        return res.status(500).send('Token exchange or product fetch failed.');
    }
}


const getClientDetails = async (req,res) => {
    const {shopName} = req.body;
    if(!shopName){
        return res.status(400).json({
            success:false,
            message:"shop name is missing"
        })
    }
    try {
        const client = await Client.findOne({ shopName });
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }
        return res.status(200).json({
            success: true,
            message:"successfully fetch the details",
            data: client
        });
    } catch (error) {
        console.error('Error fetching client details:', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

}

module.exports = {
    handleAuthCallback,
    getClientDetails,
};