////////////////////////////////////////
// * MIDDLEWARE GESTION DE FICHIERS * //     
///////////////////////////////////////

// Multer est un package de gestion de fichiers
const multer = require('multer');

// constante dictionnaire MIME pour résoudre l'extension de fichier appropriée : 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

const storage = multer.diskStorage({ // La fonction diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants
    destination: (req, file, callback) => { // La fonction "destination" indique à multer d'enregistrer les fichiers dans le dossier images
      callback(null, 'images');
    },
    filename: (req, file, callback) => { // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
  });

  // Export du multer configuré en lui passant notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image grâce à la méthode single()
  module.exports = multer({storage: storage}).single('image');