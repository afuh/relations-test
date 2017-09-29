const express = require('express')
const router = express.Router()

const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');


router.get('/', (req, res) => res.send('todo bien'));

module.exports = router;
