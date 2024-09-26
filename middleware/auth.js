// If the user is authenticated through session and login requirements,
// they will be directed to the next page in the stack, or whatever they
// were authenticated for. If not, they will be directed to the login page.
function isAuthenticated(req, res, next) {
  if(req.session.isAuthenticated) {
    return next()
  } else {
    res.redirect('/user/login');
  }
}

module.exports = isAuthenticated;