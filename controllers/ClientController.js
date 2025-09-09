const axios = require('axios');
const Client = require('../models/Client');

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL



// const handleAuthCallback = async (req, res) => {
//     const { code, shop } = req.query;
//     console.log("Redirecting to:", FRONTEND_URL);
//     if (!code || !shop) {
//         return res.status(400).send('Missing code or shop parameter.');
//     }

//     try {
//         const client = await Client.findOne({ shop });
//         if(client){
//             return res.redirect(FRONTEND_URL);
//         }
//         const tokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
//             client_id: API_KEY,
//             client_secret: API_SECRET,
//             code,
//         });

//         const accessToken = tokenResponse.data.access_token;
//         console.log("Access Token:", accessToken);
//         if(!accessToken){
//             return res.status(403).json({
//                 success:false,
//                 message:"access not found please try again"
//             })
//         }
//         const createClient = await Client.create({
//             shopName:shop,
//             accessToken:accessToken,
//         })
//         if(!createClient){
//             return res.status(401).json({
//                 success:false,
//                 message:"Can't create client please try again"
//             })
//         }
//         return res.redirect(FRONTEND_URL);

//     } catch (error) {
//         console.error('Error during auth callback:', error?.response?.data || error.message);
//         return res.status(500).send('Token exchange or product fetch failed.');
//     }
// }



const sessionStore = new Map();

const handleAuthCallback = async (req, res) => {
  const { code, shop, state } = req.query;

  if (!shop || !code) {
    console.log("worng statement");
    return res.status(400).send('Missing code or shop parameter.');
  }

  console.log("data 1",shop,code)

  const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`;

  try {
    // Always get a new token — app install flow guarantees it's a fresh one
    const tokenResponse = await axios.post(`https://${shopDomain}/admin/oauth/access_token`, {
      client_id: API_KEY,
      client_secret: API_SECRET,
      code,
    });

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(403).json({ success: false, message: 'Access token not received.' });
    }

    // Save/update token in DB
    await Client.findOneAndUpdate(
      { shopName: shopDomain },
      { accessToken },
      { upsert: true, new: true }
    );

    // Redirect with token or just shop/state
    return res.redirect(`${FRONTEND_URL}/authDone?shop=${shop}&state=${state}&access_token=${accessToken}`);
  } catch (error) {
    console.error('Auth Callback Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate and get access token',
      details: error.response?.data || error.message,
    });
  }
};


const getClientProducts = (req, res) => {
  const sessionId = req.cookies.session_id;
  if (!sessionId || !sessionStore.has(sessionId)) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid.' });
  }

  const products = sessionStore.get(sessionId);
  sessionStore.delete(sessionId); // one-time use (optional)

  return res.json({ success: true, products });
};


const getClientDetails = async (req,res) => {
    const { shopName } = req.query;
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


const getTempData = async(req,res)=>{
    try {
        const {id} = req.query;

        if(!id)return res.status(400).json({
            success:false,
            message:"id not found"
        })
        const reqData = await Client.findById(id);
        if(!reqData)return res.status(400).json({
            success:false,
            message:"data not found"
        })

        return res.status(201).json({
            success:true,
            message:"data got successfully",
            data:reqData
        })

    } catch (error) {
        console.error('Error fetching products data:', error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    handleAuthCallback,
    getClientDetails,
    getTempData,
    getClientProducts
};