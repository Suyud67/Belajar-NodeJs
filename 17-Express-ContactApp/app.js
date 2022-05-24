const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { simpanData } = require('./utils/contacts');
const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Built-in middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/mainLayout',
    title: 'Halaman Utama',
  });
});

app.get('/siswa', (req, res) => {
  const banyakSiswa = simpanData();
  res.render('data-siswa', {
    layout: 'layouts/mainLayout',
    title: 'Halaman Data Siswa',
    banyakSiswa,
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/mainLayout',
    title: 'Halaman About',
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>Page Not Found!</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
