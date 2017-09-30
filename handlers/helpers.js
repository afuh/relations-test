exports.site = 'http://localhost:8080'

exports.ui = process.argv.includes('UI')

exports.categories = ['nature', 'cats', 'buisness', 'space', 'development']

exports.show = obj => JSON.stringify(obj, null, 2);

exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login');
}
