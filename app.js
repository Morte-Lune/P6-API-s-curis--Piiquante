////////////////////////////
//* APPLICATION EXPRESS * //
///////////////////////////

const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const saucesRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();


const app = express();


///////////////////////
//* ERREURS DE CORS *//
//////////////////////

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

///////////////
//* MONGODB *//
//////////////

// Connection du serveur Node à MongoDB : 
mongoose.connect(
  `mongodb+srv://${process.env.MD_USERNAME}:${process.env.MD_PASSWORD}@${process.env.MD_URL}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json()); 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

module.exports = app;