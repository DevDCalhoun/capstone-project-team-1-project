const express = require('express');
const path = require('path');

const app = express();

const mongoose = require('mongoose');
const UserAccounts = require('./models/userAccounts');

mongoose.connect('mongodb://localhost:27017/disruptutor')

const db = mongoose.connection; //shortcut variable
db.on('error', console.error.bind(console, "connection"))
db.once('open', () => {
  console.log("Database connected");
})

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
  
})

app.get('/about', (req, res) => {
  res.render('about');
})

// 404 error route for undefined routes
app.use((req, res, next) => {
  res.status(404).render('404error')
})

// route for handling general errors that are not undefined routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error')
})

module.exports = app;