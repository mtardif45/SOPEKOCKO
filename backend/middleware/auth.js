const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // extraction du token du header Authorization de la requête entrante
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // fonction qui va décoder le token
        const userId = decodedToken.userId; // extraction id utilisateur
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next(); // execution de la fonction
        }
    } catch { // affichage de l'erreur
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};