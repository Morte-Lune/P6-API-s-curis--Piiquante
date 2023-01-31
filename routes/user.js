///////////////                                                                                                                                                                                                                                                                                                                                                                                                            
//* ROUTES  *//        ** Utilisateur **
//////////////

const express = require('express'); // Appel d'express pour pouvoir créer un router 
const router = express.Router(); // Création du router avec la fonction router d'express 
const userControllers = require('../controllers/user'); // Appel du contrôleur pour associer les fonctions aux différentes routes

router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

// Exporter le router : 
module.exports = router;