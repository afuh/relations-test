const express = require('express')
const router = express.Router()

const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');

const { catchErrors, isLoggedIn } = require('./handlers/helpers')

// Home
router.get('/', (req, res) => {
  const error = { message: "Please login. Go to /login"}
  const success = { message: `Hi ${req.user && req.user.name}. If you want to see your profile go to /u/${req.user && req.user.username} `}

  res.json(!req.user ? error : success)
});

// Login/Logut
router.get('/login', auth.login)
router.get('/gh', auth.authenticate)
router.get('/logout', auth.logout)

// Show Profile
router.get('/u/:username', catchErrors(user.showProfile))

// Upload Image
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
// Show Image
router.get('/p/:image', catchErrors(img.showImage))


// Add comment
router.post('/c/:image',
  catchErrors(comment.addComment)
);

// Remove comment
router.get('/c/:id/remove',
  catchErrors(comment.removeComment)
);


module.exports = router;
