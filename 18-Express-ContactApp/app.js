const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { send } = require('express/lib/response');
const { storeData, tambahSiswa, cekDuplikat } = require('./utils/contacts');
const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

//build-in middleware
app.use(express.static('public'));

// build-in middleware untuk parse data yang dikirim
// digunakan ke setiap middleware
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

// halaman index atau utama
app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/mainLayout',
    title: 'Halaman Utama',
  });
});

// halaman data siswa
app.get('/siswa', (req, res) => {
  const banyakSiswa = storeData();
  res.render('data-siswa', {
    layout: 'layouts/mainLayout',
    title: 'Halaman Data Siswa',
    banyakSiswa,
    // menerima pesan msg yang dikirim dari middleware post
    msg: req.flash('msg'),
  });
});

// halaman tambah siswa
app.get('/siswa/add', (req, res) => {
  res.render('add-siswa', {
    title: 'Form Tambah Siswa',
    layout: 'layouts/mainLayout',
  });
});

// memproses data form
app.post(
  '/siswa',
  [
    body('nama').custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error('Nama siswa sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
  ],
  (req, res) => {
    // jika terjadi error saat validasi akan disimpan ke var errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('add-siswa', {
        title: 'Form Tambah Siswa',
        layout: 'layouts/mainLayout',
        errors: errors.array(),
      });
    } else {
      tambahSiswa(req.body);
      // mengirim pesan flash
      req.flash('msg', 'Data Berhasil Disimpan!');
      res.redirect('/siswa');
    }
  }
);

// halaman about
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/mainLayout',
    title: 'Halaman About',
  });
});

// middleware ketika halaman tidak ditemukan
app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>Page Not Found!</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}, http://localhost:${port}`);
});
