const bcrypt = require('bcrypt');
const User = require('../models/user');

// Error handling and route logic for the user profile route
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');

    if(!user) {
      return res.redirect('/user/login');
    }
    
    res.render('userProfile', { user });
  } catch (error) {
    console.error("Profile error: ", error);
    res.status(500).send('Internal server error');
  }
}

// Route logic for user login page
exports.getLogin = (req, res) => {
  res.render('login');
}

// Error handling and route logic for the user login route
exports.postLogin = async (req, res, next) => {
  const {username, password } = req.body;

  try {
    if(!username || !password) {
      return res.render('login', {error: 'Please enter both username and password'});
    }

    const user = await User.findOne({ username });

    if(!user) {
      return res.render('login', {error: 'Invalid login information'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.render('login', {error: 'Invalid login information'});
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isAuthenticated = true;
  
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Login error: ', error);
    response.status(500).render('login', {error: 'An error occured. Please try again later.'});
  }
}

exports.postLogout = (req, res) => {
  req.session.destroy((error) => {
    if (err) {
      console.error("There was an error logging you out: ", error);
      return res.status(500).send('Internal Server Error');
    }

  })

  res.clearCookie('session');

  res.redirect('/user/login');
};