//////////////////
//* CONTRÔLEUR *//        // Sauces //
/////////////////

const Sauces = require('../models/Sauce');

  ////////////////////////
  // CREER UNE SAUCE // *******************************************************
  ///////////////////////
exports.createSauces = (req, res, next) => {

    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    delete saucesObject._userId;

    const sauces = new Sauces({
      ...saucesObject,
      _userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
      .catch(error => { res.status(400).json({ error})}
    )
  }; 

  ////////////////////////
  // MODIFIER UNE SAUCE // *******************************************************
  ///////////////////////
  exports.modifySauces = (req, res, next) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((Sauces) => {
            if (Sauces.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

  ////////////////////////
  // SUPPRIMER UNE SAUCE // *******************************************************
  ///////////////////////
exports.deleteSauces = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  ////////////////////////
  // PRENDRE UNE SAUCE // *******************************************************
  ///////////////////////
exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(404).json({ error }));
  }

  ///////////////////////////////
  // PRENDRE TOUTES LES SAUCES // *******************************************************
  //////////////////////////////
exports.getALLSauces = (req, res, next) => {
    Sauces.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
  }

  ///////////////////////
  // LIKER UNE SAUCES // *******************************************************
  /////////////////////
exports.likeSauces = (req, res, next) => {
    console.log('Sauce');
  }
  