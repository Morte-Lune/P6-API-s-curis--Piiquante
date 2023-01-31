///////////////                                                                                                                                                                                                                                                                                                                                                                                                            
//* ROUTES  *//        ** Sauces **
//////////////

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Appel du middleware qui vas servir à protéger nos routes sauce en passant l'argument "auth" aux routes à protéger
const multer = require('../middleware/multer-config');
const ctrlSauces = require('../controllers/sauces')

//////////
// CRUD //
//////////

router.post('/', auth, multer,  ctrlSauces.createSauces);
router.get('/:id', auth,  ctrlSauces.getOneSauces);
router.put('/:id', auth, multer,  ctrlSauces.modifySauces);
router.delete('/:id', auth,  ctrlSauces.deleteSauces);
router.get('/', auth, ctrlSauces.getALLSauces);
router.post('/:id/like', auth, ctrlSauces.likeSauces)

// Exporter le router : 
module.exports = router;
