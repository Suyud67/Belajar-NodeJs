const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);

// build in middleware
app.use(express.static('public'));

// membuat json parse
const jsonParse = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Halaman Utama',
  });
});

app.post('/user', urlencodedParser, (req, res) => {
  res.render('user-page', {
    layout: 'layouts/main-layout',
    title: 'Halaman User',
    userData: req.body,
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('Page Not Found');
});

app.listen(port, () => {
  console.log(`Server jalan di port:${port}, http://localhost:${port}`);
});
