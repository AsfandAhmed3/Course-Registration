module.exports = (req, res, next) => {
    if (req.session && req.session.user && req.session.userType === 'admin') {
      next();
    } else {
      res.redirect('/auth/login');
    }
  };
  