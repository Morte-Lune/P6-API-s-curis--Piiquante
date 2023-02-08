///////////////                                                                                                                                                                                                                                                                                                                                                                                                            
//* ROUTES  *//        ** Sauces **
//////////////

const express = require('express');
const router = express.Router();
 // Middleware auth qui sécurise nos routes sauces : 
const auth = require('../middleware/auth');
// Package multer gestion de fichiers :
const multer = require('../middleware/multer-config');
const ctrlSauces = require('../controllers/sauces')

router.post('/', auth, multer, ctrlSauces.createSauces);
router.post('/:id/like', auth, ctrlSauces.likeSauces)

router.get('/:id', auth, ctrlSauces.getOneSauces);
router.get('/', auth, ctrlSauces.getALLSauces);

router.put('/:id', auth, multer, ctrlSauces.modifySauces);

router.delete('/:id', auth, ctrlSauces.deleteSauces);


// Exporter le router : 
module.exports = router;
