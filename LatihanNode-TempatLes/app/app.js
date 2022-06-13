const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// import dari folder utils
const { storeData, findStudent, cekDuplikat, tambahSiswa, deleteStudent, updateDataSiswa } = require('../utils/data-siswa');

const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);

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

// halaman utama
app.get('/', (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Homepage',
  });
});

// halaman about
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'About Lemon',
  });
});

// halaman harga les
app.get('/harga', (req, res) => {
  res.render('harga', {
    layout: 'layouts/main-layout',
    title: 'Price in Lemon',
  });
});

// halaman data siswa
app.get('/siswa', (req, res) => {
  const students = storeData();
  res.render('layouts/siswa', {
    layout: 'layouts/main-layout',
    title: 'Teman Kelas',
    students,
    msg: req.flash('msg'),
  });
});

// halaman details data siswa
app.get('/siswa/detail/:nama', (req, res) => {
  // function untuk mengambil data 1 siswa
  const student = findStudent(req.params.nama);

  if (!student) {
    res.status(404);
    res.send(`Maaf, siswa atas nama ${req.params.nama} tidak ada!`);
  } else {
    // data yang didapat akan dikirim ke halaman detail-siswa
    res.render('detail-siswa', {
      layout: 'layouts/main-layout',
      title: 'Detail Siswa',
      student,
    });
  }
});

// halaman tambah siswa
app.get('/siswa/add', (req, res) => {
  res.render('add-siswa', {
    layout: 'layouts/main-layout',
    title: 'Halaman Daftar Siswa',
  });
});

// memproses data form add-siswa.ejs
app.post(
  '/siswa/add',
  [
    // validasi nama, email, nomer hp
    body('nama').custom((value) => {
      const duplikat = cekDuplikat(value);
      if (duplikat) {
        throw new Error('Nama siswa sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('noHp', 'Nomer Anda Tidak Diketahui!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    // jika terjadi error saat validasi akan disimpan ke var errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-siswa', {
        title: 'Form Tambah Siswa',
        layout: 'layouts/main-layout',
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

// delete siswa menggunakan rest API (get, post, delete, put)
app.get('/siswa/delete/:nama', (req, res) => {
  const siswa = findStudent(req.params.nama);

  if (!siswa) {
    res.status(404);
    res.send(`<h1>Maaf Nama Siswa ${req.params.nama} Tidak Ditemukan</h1>`);
  } else {
    deleteStudent(siswa);
    // mengirim pesan flash
    req.flash('msg', 'Data Berhasil Dihapus!');
    res.redirect('/siswa');
  }
});

// update data siswa (UI)
app.get('/siswa/edit/:nama', (req, res) => {
  const dataSiswa = findStudent(req.params.nama);

  res.render('edit-siswa', {
    layout: 'layouts/main-layout',
    title: 'Form Edit Siswa',
    dataSiswa,
  });
});

// memproses data dari form edit-siswa.ejs
app.post(
  '/siswa/update',
  [
    // validasi nama, email, nomer hp
    body('nama').custom((value, { req }) => {
      const duplikat = cekDuplikat(value);
      if (value !== req.body.namaLama && duplikat) {
        throw new Error('Nama siswa sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email Tidak Valid!').isEmail(),
    check('noHp', 'Nomer Anda Tidak Diketahui!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    // jika terjadi error saat validasi akan disimpan ke var errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-siswa', {
        title: 'Form Edit Data Siswa',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        dataSiswa: req.body,
      });
    } else {
      updateDataSiswa(req.body);
      // // mengirim pesan flash
      req.flash('msg', 'Data Berhasil Disimpan!');
      res.redirect('/siswa');
    }
  }
);

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}, http://localhost:${port}`);
});
