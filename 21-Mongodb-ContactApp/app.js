const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');

// package untuk menggunakan req method DELETE atau PUT
const methodOverride = require('method-override');

//connect ke db dan mengambil data siswa di folder model
require('./utils/db');
const student = require('./model/siswa');

const app = express();
const port = 3000;

// setup ejs
app.set('view engine', 'ejs');
app.set('layout', 'layouts/mainLayout');
app.use(expressLayouts);

// setup method-override
app.use(methodOverride('_method'));

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
  // mengambil data dari mongodb async await
  const students = await student.find();
  res.render('data-siswa', {
    title: 'Halaman Data Siswa',
    students,
    // menerima pesan msg yang dikirim dari middleware post
    msg: req.flash('msg'),
  });
});

// halaman tambah siswa
app.get('/siswa/add', (req, res) => {
  res.render('add-siswa', {
    title: 'Form Tambah Siswa',
  });
});

// memproses data form tambah siswa
// validasi menggunakan express-validator
app.post(
  '/siswa',
  [
    body('nama').custom(async (value) => {
      const duplikat = await student.findOne({ nama: value });
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
      student.insertMany(req.body, (error, result) => {
        // mengirim pesan flash
        req.flash('msg', 'Data Berhasil Disimpan!');
        res.redirect('/siswa');
      });
    }
  }
);

// menghapus data siswa (method DELETE)
app.delete('/siswa', (req, res) => {
  student.deleteOne({ _id: req.body.id }).then((result) => {
    // mengirim pesan flash
    req.flash('msg', 'Data Berhasil Dihapus!');
    res.redirect('/siswa');
  });
});

// halaman edit siswa
app.get('/siswa/edit/:nama', async (req, res) => {
  const siswa = await student.findOne({ nama: req.params.nama });

  res.render('edit-siswa', {
    title: 'Form Edit Siswa',
    layout: 'layouts/mainLayout',
    siswa, // mengirim data param ke halaman edit-siswa.ejs
  });
});

// mengolah form data edit siswa
app.put(
  '/siswa',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await student.findOne({ nama: value });

      // mengecek jika nama baru tidak sama dengan nama lama
      // akan tetapi duplikat kirim pesan error
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
      student
        .updateOne(
          { _id: req.body.id },
          {
            $set: {
              nama: req.body.nama,
              email: req.body.email,
              alamat: req.body.alamat,
            },
          }
        )
        .then((result) => {
          // mengirim pesan flash
          req.flash('msg', 'Data Berhasil Diubah!');
          res.redirect('/siswa');
        });
    }
  }
);

app.listen(port, () => {
  console.log(`Mongo Connected at http://localhost:${port}`);
});
