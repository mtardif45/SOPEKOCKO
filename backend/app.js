// import des package
const express = require('express');
const app = express(); // création d'une appli express
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // import de l'application Mongoose qui facilite les intéractions avec la base de données
const helmet = require('helmet'); // protège l'appli de certaines des vulnérabilités en configurant de manière appropriée des en-têtes HTTP.
require('dotenv').config(); // variables d'environnement 

const path = require('path');// accès au path de notre serveur
//importation des fichiers routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// connection à MongoDB sécurisée avec des identifiants génériques
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(helmet());

//ces headers permettent d'accéder à notre API depuis n'importe quelle origine ( '*' ) 
// d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
// d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// définition du json de body-parser comme middleware global 
app.use(bodyParser.json());

//enregistrement des routes uniques 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
// gestionnaire de routage qui indique à Express de gérer la ressources images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;