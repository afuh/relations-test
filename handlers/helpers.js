exports.site = 'http://localhost:8080'
exports.ui = process.argv.includes('UI')

exports.categories = ['nature', 'cats', 'buisness', 'space', 'development']

exports.show = obj => JSON.stringify(obj, null, 2);

exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// Awesome library to manipulate and display dates
// http://momentjs.com/
exports.moment = require('moment')

exports.notFound = (req, res) => {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
};

// Simple route middleware to ensure that the user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated, the request will proceed.
// Otherwise, the user will be redirected to the login page.
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login');
}
