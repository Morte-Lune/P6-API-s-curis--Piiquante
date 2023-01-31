////////////////
//*  SCHEMA  *//      ** Utilisateur **
///////////////

const mongoose = require('mongoose');

/* Installation du package "mongoose-unique-validator" pour l'amélioration des messages d'erreur 
lors de l'enregistrement de données uniques*/
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // Utilisation du mot clé unique pour l'attribut email, pour que deux utilisateurs n'utilisent pas la même adresse e-mail ! 
    password: { type: String, required: true }
});

// La valeur unique dans le schéma "userSchema" avec l'élément "mongoose-unique-validator" passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail ! 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
