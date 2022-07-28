const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//connect ke db dan mengambil data siswa di folder model
require('./utils/db');
const student = require('./model/siswa');

const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');
app.set('layout', 'layouts/mainLayout');
app.use(expressLayouts);

//build-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// konfigurasi pesan flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// halaman utama
app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'udin',
      email: 'udinGaming@gmail.com',
    },
    {
      nama: 'joko',
      email: 'jokoGaming@gmail.com',
    },
    {
      nama: 'tina',
      email: 'tinaGaming@gmail.com',
    },
  ];

  res.render('index', {
    title: 'Halaman Utama',
    mahasiswa,
  });
});

// halaman about
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Halaman About',
  });
});

// halaman data siswa
app.get('/siswa', async (req, res) => {
  // mengambil data dari mongodb menggunakan promise
  // const students = student.find().then((data) => console.log(data));

  // mengambil data dari mongodb async await
  const students = await student.find();
  res.render('data-siswa', {
    title: 'Halaman Data Siswa',
    students,
    // menerima pesan msg yang dikirim dari middleware post
    msg: req.flash('msg'),
  });
});

app.listen(port, () => {
  console.log(`Mongo Connected at http://localhost:${port}`);
});
