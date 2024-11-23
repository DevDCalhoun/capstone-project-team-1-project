const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const csurf = require('csurf');
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");
const MemoryStore = require('memorystore')(session); // In-memory session store for testing
const errorHandler = require('./middleware/errorHandler');
const logger = require('./logging/logger'); 
const bodyParser = require('body-parser');
const register = require('./routes/register');
const userRoutes = require('./routes/userRoutes');
const SearchParameters = require('./classes/search');
const flash = require('connect-flash');

const User = require('./models/user');

const port = process.env.PORT || 3000; // Default to 3000 if not specified

// Middleware
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Logging
// Logs each request
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
})

// Allows objects and arrays to be encoded into the URL-encoded format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// The database URL for connection and jest testing purposes
const dbUrl = process.env.DB_URL || (process.env.NODE_ENV === 'test' ? global.__MONGO_URI__ || 'mongodb://localhost:27017/testDB' : 'mongodb://localhost:27017/disruptutorDB');

// Connects to and opens the database
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
})

// MongoStore is used to maintain user sessions across server restarts
const secret = process.env.SECRET || 'non-production-secret'; //secret key to be used for session management
// Conditionally use MongoStore or MemoryStore for sessions
const store = process.env.NODE_ENV === 'test'
  ? new MemoryStore({ checkPeriod: 86400000 }) // 24 hours for cleanup in memory
  : MongoStore.create({
      mongoUrl: dbUrl,
      secret,
      touchAfter: 24 * 60 * 60,
    });

store.on("error", function(e) {
  console.log("Session store error");
})

//Configures data for session management
const sessionConfig = {
  store,
  name: `session_${port}`, // Unique session cookie per instance
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: Date.now() + 1000 * 60 * 15,
    maxAge: 1000 * 60 * 15
  }
};

app.use(session(sessionConfig)) // Use session configuration information

// Apply CSRF protection in production. Excluded for jest testing
if (process.env.NODE_ENV !== 'test') {
  app.use(csurf());

  // Middleware to pass CSRF token to all views
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Make the CSRF token available to all views
    next();
  });
}
// Mock CSRF token for testing
if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    res.locals.csrfToken = 'test-csrf-token'; 
    next();
  });
}

// Allows EJS templates to make use of session information
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || null;
  res.locals.userId = req.session.userId
  res.locals.isTutor = req.session.isTutor;
  next();
});

// Used for flashing error/success messages to users within any route
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg'); // Array of success messages
  res.locals.error_msg = req.flash('error_msg');     // Array of error messages
  next();
});

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.get('/search', async (req, res) => {
  try {
    const tutors = await User.find({ isTutor: true });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    res.render('search', { tutors, days });
  }
  catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.post('/search', async (req, res) => {
  try {
    const searchParams = new SearchParameters(req.body);
    const query = searchParams.createQuery();

    const tutors = await User.find(query);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    res.render('search', { tutors, days, searchParams: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

// Route to register.js
app.use('/users', register);

// Addes routes for users
app.use('/user', userRoutes);

// Adds routing for making appointments
app.use('/appointments', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});
app.use(errorHandler);

module.exports = app;