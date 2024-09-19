const express = require('express');
const path = require('path');

const app = express();
const port = 3000;


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
})