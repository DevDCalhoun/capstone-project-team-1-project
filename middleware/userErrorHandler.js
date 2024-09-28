const bcrypt = require('bcrypt');

module.exports.profileErrors = (req, res, user) => {
  // Checks if user exists
  if(!user) {
    return res.redirect('/user/login');
  }
}

module.exports.loginHandler = async (req, res, user) => {
      const { username, password } = req.body;
      
      // Re-renders login page if both username and password are not provided
      if(!(username || password)) {
        console.log("here in login handler");
        return res.render('login', {error: 'Please enter both username and password'});
      }
      
      // re-renders login page if user does not exist
      if(user) {
        const isMatch = await bcrypt.compare(password, user.password); // used to compare encrypted password with database password
        if(!isMatch) {
          return res.render('home', {error: 'Invalid login information'});
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.isAuthenticated = true;
      }
    
      res.redirect('/user/profile');
}
