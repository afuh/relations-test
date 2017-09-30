const express = require('express')
const router = express.Router()

const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');
const category = require('./controllers/categoryControllers');

const { catchErrors, isLoggedIn } = require('./handlers/helpers')

// Home
router.get('/', (req, res) => {
  const error = { message: "Please login. Go to /login"}
  const success = { message: `Hi ${req.user && req.user.name}. If you want to see your profile go to /${req.user && req.user.username} `}

  res.json(!req.user ? error : success)
});

// Login/Logut
router.get('/login', auth.login)
router.get('/gh', auth.authenticate)
router.get('/logout', auth.logout)

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

// Get category
router.get('/category/', catchErrors(category.getCategories))
router.get('/category/:name', catchErrors(category.getCategory))

// Show Profile
router.get('/:username', catchErrors(user.showProfile))


// Show Image
router.get('/p/:image', catchErrors(img.showImage))


// Add comment
router.post('/c/:image',
  catchErrors(comment.addComment)
);

// Remove comment
router.get('/c/:id/remove', catchErrors(comment.removeComment));



module.exports = router;
