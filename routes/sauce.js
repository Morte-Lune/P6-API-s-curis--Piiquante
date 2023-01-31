///////////////                                                                                                                                                                                                                                                                                                                                                                                                            
//* ROUTES  *//        ** Sauces **
//////////////

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Appel du middleware qui vas servir à protéger nos routes sauce en passant l'argument "auth" aux routes à protéger
const multer = require('../middleware/multer-config');
const ctrlSauces = require('../controllers/sauces')

//*********************************************************************//

router.post('/', auth, multer, ctrlSauces.createSauces);
router.post('/:id/like', auth, ctrlSauces.likeSauces)

router.get('/:id', auth, ctrlSauces.getOneSauces);
router.get('/', auth, ctrlSauces.getALLSauces);

router.put('/:id', auth, multer, ctrlSauces.modifySauces);

router.delete('/:id', auth, ctrlSauces.deleteSauces);


// Exporter le router : 
module.exports = router;
