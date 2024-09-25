function isAuthenticated(req, res, next) {
  if(req.session.isAuthenticated) {
    return next()
  } else {
    res.redirect('/user/login');
  }
}

module.exports = isAuthenticated;