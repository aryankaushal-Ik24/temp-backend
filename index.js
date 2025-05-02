require('dotenv').config();
const express = require('express');
const axios = require('axios');
const clientRoutes = require('./routes/clientRoutes');
const app = express();

app.get('/',async(_,res)=>{
  return res.send('ok tested');
})

app.use('/api/v1',clientRoutes);


app.listen(3000, () => console.log('✅ Server running on port 3000'));
