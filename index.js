require('dotenv').config();
const express = require('express');
const clientRoutes = require('./routes/clientRoutes');
const { connectToDatabase } = require('./DB/database');
const app = express();


app.get('/',async(_,res)=>{
  return res.send('ok tested');
})

app.use('/api/v1',clientRoutes);


connectToDatabase()
.then(()=>{
  console.log("mongodb connected and lets listen a server")
  app.listen(3000, () => console.log('Server running on port 3000'));
})
.catch((error)=>{
  console.log("error occured while connecting to mongodb",error.message)
})

