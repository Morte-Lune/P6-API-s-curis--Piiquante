////////////////////////////
//* APPLICATION EXPRESS * //
///////////////////////////

const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const saucesRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');// Import du router utilisateur : 
const path = require('path');

const app = express(); // Appelle de la méthode Express pour créer une application Express

// Utiliser pour gérer la requête POST venant du front pour extraire le corps JSON :
app.use(express.json());

//********** ERREURS DE CORS **********//
// C'est le premier middleware qui sera éxcécuté par le serveur :
// Appliquer à toutes les requète envoyers à notre serveurs :
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//************* MONGODB ***************//
// Connection du serveur Node à MongoDB : 
mongoose.connect('mongodb+srv://MarineG:mX4dNc2kSNlJR4Dg@clusterpiiquante.ugvvlh3.mongodb.net/?retryWrites=true&w=majority',
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

// Exporte l'application pour qu'elle soit utilisable par les autres fichiers : 
module.exports = app;