const express = require('express');
const router = express.Router(); // création du router express
const userCtrl = require('../controllers/user'); // import des controlleurs sauce

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;