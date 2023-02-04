//////////////////
//* CONTRÔLEUR *//        // Sauces //
/////////////////

const Sauces = require('../models/Sauce');
// Package fs de Node donne accées à des fonctions notament pour supprimer les fichiers : 
const fs = require('fs');

  ////////////////////////
  // CREER UNE SAUCE // *******************************************************
  ///////////////////////
exports.createSauces = (req, res, next) => {

    const saucesObject = JSON.parse(req.body.sauce);
    delete saucesObject._id;
    delete saucesObject._userId;

    // Construction de l'objet sauce à enregistrer dans la base de données : 
    const sauces = new Sauces({
      ...saucesObject,
      _userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
      .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
      .catch(error => { res.status(400).json({ error})}
    )
  }; 

  ////////////////////////
  // MODIFIER UNE SAUCE // *******************************************************
  ///////////////////////
  exports.modifySauces = (req, res, next) => {
    // Récupère l'ID de la sauce à partir des paramètres de la requête.
    const sauceId = req.params.id;
    
    // Trouve la sauce dans la base de données en utilisant son ID.
    Sauces.findOne({ _id: sauceId })
      .then((sauce) => {
        // Si aucune sauce n'a été trouvée, renvoie une erreur 404 avec un message d'erreur.
        if (!sauce) {
          return res.status(404).json({ error: "Sauce inéxistante" });
        }
  
        // Supprime l'ancienne image associée à la sauce.
        const oldImagePath = `${process.cwd()}/images/${sauce.imageUrl.split("/images/")[1]}`;
        fs.unlink(oldImagePath, (error) => {
          if (error) {
            console.error(error);
          }
        });
  
        // Si une nouvelle image a été téléchargée avec la requête, la ajoute à l'objet "sauceObject".
        // Sinon, ajoute simplement les autres données de la requête à l'objet "sauceObject".
        //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        const saucesObject = req.file ? {
            //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
          ...JSON.parse(req.body.sauce), 
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };
  
        // Supprime la propriété "_userId" de l'objet "sauceObject".
        delete saucesObject._userId;
  
        // Si l'utilisateur actuel n'est pas le propriétaire de la sauce, renvoie une erreur 401 avec un message d'erreur.
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: "Vous n'etes pas authorisé à modifer cette sauce" });
        } else {
          // Met à jour la sauce dans la base de données en utilisant les données de "sauceObject".
          Sauces.updateOne(
            { _id: sauceId },
            { ...saucesObject, _id: sauceId }
          )
            .then(() => {
              // Renvoie un message de succès si la mise à jour a réussi.
              res.status(200).json({ message: "Votre sauce à bien été modifiée " });
            })
            .catch((error) => {
              // Renvoie une erreur si la mise à jour a échoué.
              res.status(401).json({ error });
            });
        }

  
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

  ////////////////////////
  // SUPPRIMER UNE SAUCE // *******************************************************
  ///////////////////////

  // La méthode unlink() du package fs permet de supprimer un fichier du système de fichier : 
  exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(Sauces => {
            if (Sauces.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = Sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

  ////////////////////////
  // PRENDRE UNE SAUCE // *******************************************************
  ///////////////////////
exports.getOneSauces = (req, res, next) => {

  // Cherche la sauce en base de données avec l'ID spécifié dans la requête :
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
  // LIKER/ DISLIKER UNE SAUCES // *******************************************************
  /////////////////////
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