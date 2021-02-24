const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // plugin 

// création du schéma de données strict pour l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // application de la méthode plugin à notre schéma avec argument "unique validator"

// export du schéma dans notre application express 
module.exports = mongoose.model('user', userSchema);