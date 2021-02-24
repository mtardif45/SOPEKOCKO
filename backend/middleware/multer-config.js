const multer = require('multer');// import package multer

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// constante indiquant à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images'); // destination = fichier image
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// export de l'élément multer & on lui indique qu'on traite uniquement les images
module.exports = multer({ storage: storage }).single('image'); 