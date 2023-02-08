//////////////////
//* CONTRÔLEUR *//        // Sauces //
/////////////////

const Sauces = require('../models/Sauce');
const fs = require('fs');


//////////////////////
// CREER UNE SAUCE // 
////////////////////

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
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) }
    )
};

////////////////////////
// MODIFIER UNE SAUCE // 
///////////////////////

exports.modifySauces = (req, res, next) => {

  const sauceId = req.params.id;

  const saucesObject = req.file ? {

    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  }
    : { ...req.body };


  delete saucesObject._userId;
  Sauces.findOne({ _id: sauceId })


    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        return res.status(404).json({ error: "Sauce inéxistante" });

      } else if (req.file) {
        const filename = sauce.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, error => {
          if (error)
            throw error
        })
      }

      Sauces.updateOne(
        { _id: sauceId },
        { ...saucesObject, _id: sauceId }
      )
        .then(() => {
          res.status(200).json({ message: "Votre sauce à bien été modifiée " });
        })
        .catch((error) => {
          res.status(401).json({ error });
        });
      // }


    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


/////////////////////////
// SUPPRIMER UNE SAUCE // 
////////////////////////

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(Sauces => {
      if (Sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = Sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

///////////////////////
// PRENDRE UNE SAUCE //
//////////////////////

exports.getOneSauces = (req, res, next) => {

  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

///////////////////////////////
// PRENDRE TOUTES LES SAUCES // 
//////////////////////////////

exports.getALLSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

////////////////////////////////
// LIKER/ DISLIKER UNE SAUCES // 
///////////////////////////////

exports.likeSauces = (req, res) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => {
      if (req.body.like === 1) {
        sauces.likes++;
        sauces.usersLiked.push(req.body.userId);
        sauces.save();
      }
      if (req.body.like === -1) {
        sauces.dislikes++;
        sauces.usersDisliked.push(req.body.userId);
        sauces.save();
      }
      if (req.body.like === 0) {
        if (sauces.usersLiked.indexOf(req.body.userId) != -1) {
          sauces.likes--;
          sauces.usersLiked.splice(
            sauces.usersLiked.indexOf(req.body.userId),
            1
          );
        } else {
          sauces.dislikes--;
          sauces.usersDisliked.splice(
            sauces.usersDisliked.indexOf(req.body.userId),
            1
          );
        }
        sauces.save();
      }
      res.status(200).json({ message: "like modifié" });
    })
    .catch((error) => res.status(500).json({ error }));
};