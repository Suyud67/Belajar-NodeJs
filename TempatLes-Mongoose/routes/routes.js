const express = require('express');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const routes = express();

// import model schema dari folder model
const Students = require('../model/siswa');

// override with POST having ?_method=DELETE
routes.use(methodOverride('_method'));

// routes halaman utama
routes.get('/', (req, res) => {
  res.render('index', {
    title: 'halaman utama',
  });
});

// routes halaman about
routes.get('/about', (req, res) => {
  res.render('about', {
    title: 'halaman about',
  });
});

// routes halaman harga
routes.get('/harga', (req, res) => {
  res.render('harga', {
    title: 'halaman harga',
  });
});

// halaman data siswa
routes.get('/siswa', async (req, res) => {
  const students = await Students.find();

  res.render('layouts/siswa', {
    title: 'Teman Kelas',
    students,
    msg: req.flash('msg'),
  });
});

// halaman details data siswa
routes.get('/siswa/detail/:nama', async (req, res) => {
  const student = await Students.findOne({ nama: req.params.nama });

  if (!student) {
    res.status(404);
    res.send(`Maaf, siswa atas nama ${req.params.nama} tidak ada!`);
  } else {
    // data yang didapat akan dikirim ke halaman detail-siswa
    res.render('detail-siswa', {
      title: 'Detail Siswa',
      student,
    });
  }
});

// halaman tambah siswa
routes.get('/siswa/add', (req, res) => {
  res.render('add-siswa', {
    title: 'Halaman Daftar Siswa',
  });
});

// memproses data form add-siswa.ejs
routes.post(
  '/siswa/add',
  [
    // validasi nama, email, nomer hp
    body('nama').custom(async (value) => {
      const duplikat = await Students.findOne({ nama: value });
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
        errors: errors.array(),
      });
    } else {
      Students.insertMany(req.body, (err, result) => {
        // mengirim pesan flash
        req.flash('msg', 'Data Berhasil Disimpan!');
        res.redirect('/siswa');
      });
    }
  }
);

// halaman edit siswa
routes.get('/siswa/edit/:nama', async (req, res) => {
  const student = await Students.findOne({ nama: req.params.nama });
  res.render('edit-siswa', {
    title: 'Halaman Edit Siswa',
    student,
  });
});

// memproses data dari form edit-siswa.ejs
routes.put(
  '/siswa',
  [
    // validasi nama, email, nomer hp
    body('nama').custom((value, { req }) => {
      const duplikat = Students.findOne({ nama: value });
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
        errors: errors.array(),
        dataSiswa: req.body,
      });
    } else {
      Students.updateOne(
        { _id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            umur: req.body.umur,
            hobi: req.body.hobi,
            sekolah: req.body.sekolah,
            noHp: req.body.noHp,
            email: req.body.email,
            alasanLes: req.body.alasanLes,
          },
        }
      ).then((result) => {
        // mengirim pesan flash
        req.flash('msg', 'Data Berhasil Disimpan!');
        res.redirect('/siswa');
      });
    }
  }
);

routes.delete('/siswa', async (req, res) => {
  Students.deleteOne({ _id: req.body.id }).then((result) => {
    // mengirim pesan flash
    req.flash('msg', 'Data Berhasil Dihapus!');
    res.redirect('/siswa');
  });
});
module.exports = routes;
