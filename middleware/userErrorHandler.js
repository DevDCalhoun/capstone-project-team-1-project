const bcrypt = require('bcrypt');

module.exports.profileErrors = (req, res, user) => {
  // Checks if user exists
  if(!user) {
    return res.redirect('/user/login');
  }
}

module.exports.loginHandler = async (req, res, user) => {
  const { username, password } = req.body;
  
  // Return 400 if either username or password is missing
  if (!username || !password) {
    return res.status(400).render('login', { error: 'Please enter both username and password' });
  }
  
  // Return 401 if user does not exist or password is incorrect
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid login information' });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isAuthenticated = true;
    req.session.userRole = user.role;   // Stores user role in session for app-wide accessibility 
    return res.status(200).redirect('/user/profile');
  }

  // User not found
  res.status(401).render('login', { error: 'User not found' });
};

