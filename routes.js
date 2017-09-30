const express = require('express')
const router = express.Router()

const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');
const category = require('./controllers/categoryControllers');

const { catchErrors, isLoggedIn } = require('./handlers/helpers')


// Login/Logut
router.get('/login', auth.login)
router.get('/gh', auth.authenticate)
router.get('/logout', auth.logout)

// Upload Image
router.get('/upload',
  isLoggedIn,
  img.showForm
)
router.post('/upload',
  isLoggedIn,
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
)

// Category
router.get('/category/', catchErrors(category.getCategory))
router.get('/category/:name', catchErrors(category.getCategory))

// Show Profile
router.get('/:username', catchErrors(user.showProfile))
router.get('/', catchErrors(user.showProfiles))

// Show Image
router.get('/p/:image', catchErrors(img.showImage))

// Add comment
router.post('/c/:image',
  isLoggedIn,
  catchErrors(comment.addComment)
);

// Remove comment
router.get('/c/:id',
  isLoggedIn,
  catchErrors(comment.removeComment)
);

module.exports = router;
