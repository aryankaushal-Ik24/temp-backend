require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./DB/database');
const { handleAuthCallback, getClientDetails, getTempData, getClientProducts } = require('./controllers/ClientController');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const { addSelectedSceneWithProduct, getProductInformation, updateOptions, deleteProductMapping, getProductsToUploadOnShop } = require('./controllers/ProductController');
const app = express();

app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json())
app.use(cookieParser())

app.get('/',async(_,res)=>{
  return res.send('ok tested');
})

app.get('/auth/callback',handleAuthCallback);
app.get('/user/get-details',getClientDetails);
app.get('/user/get-product-details',getClientProducts);
app.get('/product/getData',getTempData);  //fake data

app.post('/product/add-product',addSelectedSceneWithProduct);
app.get('/product/get-product',getProductInformation);
app.post('/product/updateOptions',updateOptions);
app.get('/product/delete-product',deleteProductMapping);

app.post('/product/uploadProducts',getProductsToUploadOnShop)


connectToDatabase()
.then(()=>{
  console.log("mongodb connected and lets listen a server")
  app.listen(3001, () => console.log('Server running on port 3001'));
})
.catch((error)=>{
  console.log("error occured while connecting to mongodb",error.message)
})

