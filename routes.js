const express = require('express')
const router = express.Router()

const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');

const { catchErrors, isLoggedIn } = require('./handlers/helpers')

// Home
router.get('/', (req, res) => {
  const message = {message: "please login. Go to /login"}
  res.json(!req.user ? message : req.user)
});

// auth
router.get('/login', auth.login)
router.get('/gh', auth.authenticate)
router.get('/logout', auth.logout)

// User
router.get('/u/:username', catchErrors(user.showProfile))

// Image
router.get('/upload',
  isLoggedIn,
  (req, res) => { res.render('upload', {title: 'upload'}) }
)
router.post('/upload', 
  isLoggedIn,
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
)

module.exports = router;
