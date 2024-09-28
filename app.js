const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo");
const errorHandler = require('./middleware/errorHandler');
const logger = require('./logging/logger'); 
const bodyParser = require('body-parser');
const register = require('./routes/register');
const userRoutes = require('./routes/userRoutes');

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

// The database URL for connection purposes
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/disruptutorDB';

// Connects to and opens the database
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
})

// MongoStore is used to maintain user sessions across server restarts
const secret = process.env.SECRET || 'non-production-secret'; //secret key to be used for session management
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, // Time period in seconds
});

store.on("error", function(e) {
  console.log("Session store error");
})

//Configures data for session management
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig)) // Use session configuration information

// Allows EJS templates to make use of session information for conditional logic
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

// Put this here and the router.get and router.post methods are there
app.use('/users', register);

// Addes routes for users
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Page Not Found');
  error.status = 404;
  next(error);
});
app.use(errorHandler);

module.exports = app;