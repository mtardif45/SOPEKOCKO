const bcrypt = require('bcrypt'); // cryptage d'un string
const jwt = require('jsonwebtoken'); // import du package jsonwebtoken
const User = require('../models/user'); // import du modèle user

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  // 10 tours de la fonction de hashage 
        .then(hash => { // récupération du hash du mdp 
            const user = new User({ //création du nouvel utilisateur avec infos cryptées
                email: req.body.email, // enregistrement de l'email du body pour le paramètre email
                password: hash // enregistrement du hash pour le paramètre password
            });
            user.save() // méthode de sauvegarde 
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error: 'un compte exite déjà à cette adresse' }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // récupère les données utilisateurs
        .then(user => {
            // si aucun user correspondant, on renvoie une erreur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur inconnu!' });
            }
            // compare la correspondance avec le mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // si non valide, message d'erreur envoyé
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // si ok, on renvoie un objet json
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // on renvoie un token 
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', // clé de cryptage
                            { expiresIn: '24h' } // délai d'expiration du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};