const express = require('express');
const path = require('path');

const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const register = require('./routes/register');

// Middleware
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Allows objects and arrays to be encoded into the URL-encoded format
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/disruptutorDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error: ', err));

app.get('/', (req, res) => {
  res.render('home');
  
})

app.get('/about', (req, res) => {
  res.render('about');
})

// Put this here and the router.get and router.post methods are there
app.use(register);


// 404 error route for undefined routes
app.use((req, res, next) => {
  res.status(404).render('404error')
})

module.exports = app;