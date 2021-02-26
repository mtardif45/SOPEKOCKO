const Sauce = require('../models/sauce'); // import du modèle sauce
const fs = require('fs'); // package permettant la modification du système de fichiers

// POST - Ajout d'une sauce 
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // supprime id venant du frontend

    // création d'une nouvelle sauce 
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // remet à 0 les sauces aimées et detéstées
        likes: 0,
        dislikes: 0,
        usersLiked: [], // insertion dans un tableau vide
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Nouvelle Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// POST - ajout des likes et dislikes
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    if (like === 0) {
        Sauce.findOne({ _id: req.params.id }) // on récupère la sauce concernée
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) { // si cet utilisateur a déjà like la sauce
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersLiked: req.body.userId }, // on retire l'userId 
                            $inc: { likes: -1 }, // on retire 1 like 
                            _id: req.params.id
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Like annulé' }))
                        .catch((error) => res.status(400).json({ error }))
                }

                if (sauce.usersDisliked.includes(req.body.userId)) { // si cet utilisateur a déjà dislike la sauce
                    Sauce.updateOne( // on modifie cette sauce
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId }, // on retire  l'userId
                            $inc: { dislikes: -1 }, // on retire 1 dislike
                            _id: req.params.id
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Dislike annulé' }))
                        .catch((error) => res.status(400).json({ error }))
                }
                else {
                    () => res.status(200).json({ message: 'Merci de nous donner votre avis' })
                }
            }
            )
            .catch((error) => res.status(404).json({ error }))
    };

    if (like === 1) {
        Sauce.updateOne(//on modifie cette sauce
            { _id: req.params.id },
            {
                $push: { usersLiked: userId }, // on ajoute l'userId 
                $inc: { likes: 1 }, // on ajoute 1 like 
            }
        )
            .then(() => res.status(200).json({ message: 'Like ajouté' }))
            .catch((error) => res.status(400).json({ error }))
    };

    if (like === -1) {
        Sauce.updateOne(//on modifie cette sauce
            { _id: req.params.id },
            {
                $push: { usersDisliked: userId }, // on ajoute l'userId 
                $inc: { dislikes: 1 }, // on ajoute 1 dislike 
            }
        )
            .then(() => res.status(200).json({ message: 'dislike ajouté' }))
            .catch((error) => res.status(400).json({ error }))
    };
};

// GET - obtenir une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // récupération d'une sauce unique
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

// récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find() // récupération de la liste des sauces
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    // vérifie s'il y a déjà un fichier
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : // sinon ...
        { ...req.body };
    // modification de l'objet
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    // rechercher la sauce
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            // fonction unlink pour suppression du fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(400).json({ error }));
};

