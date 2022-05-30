const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { send } = require('express/lib/response');
const { storeData, tambahSiswa, cekDuplikat, findSiswa, deleteSiswa, updateStudents } = require('./utils/contacts');
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
// validasi menggunakan express-validator
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

// menghapus data
app.get('/siswa/delete/:nama', (req, res) => {
  // mencari nama siswa dari parameter url
  // nama siswa dikirim ke function findSiswa
  const siswa = findSiswa(req.params.nama);

  // jika nama siswa tidak ada pada file data/siswa.json
  if (!siswa) {
    res.status(404);
    res.send(`<h1>${req.params.nama} tidak ditemukan!</h1>`);
  } else {
    deleteSiswa(siswa);
    // mengirim pesan flash
    req.flash('msg', 'Data Berhasil Dihapus!');
    res.redirect('/siswa');
  }
});

// halaman edit siswa
app.get('/siswa/edit/:nama', (req, res) => {
  const siswa = findSiswa(req.params.nama);

  res.render('edit-siswa', {
    title: 'Form Tambah Siswa',
    layout: 'layouts/mainLayout',
    siswa, // mengirim data param ke halaman edit-siswa.ejs
  });
});

// path untuk mengolah data edit siswa
app.post(
  '/siswa/update',
  [
    body('nama').custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.oldName && duplikat) {
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
      res.render('edit-siswa', {
        title: 'Form Update Data Siswa',
        layout: 'layouts/mainLayout',
        errors: errors.array(),
        siswa: req.body,
      });
    } else {
      updateStudents(req.body);
      // mengirim pesan flash
      req.flash('msg', 'Data Berhasil Diubah!');
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
