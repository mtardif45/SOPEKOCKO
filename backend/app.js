// import des package
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // import de l'application Mongoose qui facilite les intéractions avec la base de données
const path = require('path');// accès au path de notre serveur

//Modèles mongoose :
const Sauces = require('./models/sauce');
const Users = require('./models/user');

//importation des fichiers routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://Mya45:sopekocko@cluster0.qiscu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

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

// gestionnaire de routage qui indique à Express de gérer la ressources images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

//enregistrement des routes uniques 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;