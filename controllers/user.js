const passport = require('passport');
// const User = require('../models/User');

/* Login page. */
// exports.getLogin = (req, res) => {
//   if (req.user) {
//     return res.redirect('/');
//   }
//   res.render('account/login', {
//     title: 'Login'
//   });
// };

/* Sign in using email and password. */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/* Log out. */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
