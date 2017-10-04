exports.site = 'http://localhost:8080'
exports.ui = process.argv.includes('UI')

exports.categories = ['nature', 'cats', 'buisness', 'space', 'development']

exports.show = obj => JSON.stringify(obj, null, 2);


// Awesome library to manipulate and display dates
// http://momentjs.com/
exports.moment = require('moment')

// Simple route middleware to ensure that the user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated, the request will proceed.
// Otherwise, the user will be redirected to the login page.
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login');
}


// ============ Error handlers ============ //
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// Development errors
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stack: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  });
};

// Production Error Hanlder. No stacktraces are leaked to user
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};
