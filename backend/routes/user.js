// import des plugin
const express = require('express');
const router = express.Router(); // création du router express

// import des controlleurs sauce
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); // Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/login', userCtrl.login);
// Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données
// et un token JSON signé contenant userID
module.exports = router;