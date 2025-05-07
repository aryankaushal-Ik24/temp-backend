require('dotenv').config();
const express = require('express');
const clientRoutes = require('./routes/clientRoutes');
const { connectToDatabase } = require('./DB/database');
const { handleAuthCallback, getClientDetails, getTempData } = require('./controllers/ClientController');
const cors = require('cors');
const { addSelectedSceneWithProduct } = require('./controllers/ProductController');
const app = express();

app.use(cors({
  origin: ['http://localhost:3001','http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json())

app.get('/',async(_,res)=>{
  return res.send('ok tested');
})

app.get('/auth/callback',handleAuthCallback);
app.get('/user/get-details',getClientDetails);
app.get('/product/getData',getTempData);  //fake data

app.post('/product/add-product',addSelectedSceneWithProduct);


connectToDatabase()
.then(()=>{
  console.log("mongodb connected and lets listen a server")
  app.listen(3001, () => console.log('Server running on port 3001'));
})
.catch((error)=>{
  console.log("error occured while connecting to mongodb",error.message)
})

