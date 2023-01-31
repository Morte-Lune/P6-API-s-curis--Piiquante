////////////////
//*CONTRÔLEUR*//        // Sauces //
///////////////

const Sauces = require('../models/Sauce');

// CREER :
exports.createSauces = (req, res, next) => {

    const saucesObject = JSON.parse(req.body.sauces);
    delete saucesObject._id;
    delete saucesObject._userId;

    const sauces = new Sauces({
      ...saucesObject,
      _userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
      .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
      .catch(error => { res.status(400).json({ error})}
    )
  }; // modifySauces / Sauces

  // MODIFIER : 
  exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.Sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((Sauces) => {
            if (Sauces.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

  // SUPPRIMER : 
exports.deleteSauces = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  }

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(404).json({ error }));
  }
  
exports.getALLSauces = (req, res, next) => {
    Sauces.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({ error }));
  }
exports.likeSauces = (req, res, next) => {
    console.log('Sauce');
  }
  