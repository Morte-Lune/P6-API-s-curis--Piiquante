////////////////
//*CONTRÔLEUR*//        // Utilisateurs //
///////////////

/* Pour rendre notre structure encore plus modulaire, 
et simplifier la lecture et la gestion de notre code, 
nous allons séparer la logique métier de nos routes en contrôleurs.*/

const bcrypt = require("bcrypt");
const jwt = require(('jsonwebtoken')) // Package jsonwebtoken qui vas pouvoir créer et vérifier les tokens d'authentification !!
const User = require('../models/User');

//////////////////////////
// * MIDDLEWARE Signup * //     pour l'enregistrement d'un nouvel utilisateur dans mongoDB:
/////////////////////////

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Appel du package bcrypt puis la fonction hash de bcrypt, qui permet de hacher le mdp ( c'est une fonction asynchrone)
    .then(hash => {const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//////////////////////////
// * MIDDLEWARE login * //     pour connecter des utilisateurs existants et vérifiez les info d'identification d'un utilisateur : 
/////////////////////////

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "Paire identifiant/mot de passe incorrect" });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: "Paire identifiant/mot de passe incorrect" });
          }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                {userId: user._id},
                'RANDOM_TOKEN_SECRET',
                {expiresIn: '24h'}
              )
            });
          
        })
        .catch(error => res.status(500).json({ error }));
      
    })
    .catch(error => res.status(500).json({ error }));
  
};
