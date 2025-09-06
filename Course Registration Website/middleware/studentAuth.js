module.exports = (req, res, next) => {
    if (req.session && req.session.user && req.session.userType === 'student') {
      next();
    } else {
      res.redirect('/auth/login');
    }
  };
  