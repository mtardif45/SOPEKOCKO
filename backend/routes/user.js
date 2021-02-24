const express = require('express');
const router = express.Router(); // création du router express
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user'); // import des controlleurs sauce

router.post('/signup', auth, userCtrl.signup);
router.post('/login', auth, userCtrl.login);

module.exports = router;