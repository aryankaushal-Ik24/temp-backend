require('dotenv').config();
const express = require('express');
const clientRoutes = require('./routes/clientRoutes');
const { connectToDatabase } = require('./DB/database');
const { handleAuthCallback, getClientDetails } = require('./controllers/ClientController');
const cors = require('cors');
const app = express();

app.use(cors({
  origin:'*'
}));
app.use(express.json())

app.get('/',async(_,res)=>{
  return res.send('ok tested');
})

app.get('/auth/callback',handleAuthCallback);
app.get('/user/get-details',getClientDetails);

connectToDatabase()
.then(()=>{
  console.log("mongodb connected and lets listen a server")
  app.listen(3000, () => console.log('Server running on port 3000'));
})
.catch((error)=>{
  console.log("error occured while connecting to mongodb",error.message)
})

