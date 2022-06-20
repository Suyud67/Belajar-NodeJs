const express = require('express');
const { body, validationResult, check } = require('express-validator');
const routes = express();

// import dari folder utils
const { storeData, findStudent, cekDuplikat, tambahSiswa, deleteStudent, updateDataSiswa } = require('../utils/data-siswa');

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
routes.get('/siswa', (req, res) => {
  const students = storeData();
  res.render('layouts/siswa', {
    title: 'Teman Kelas',
    students,
    msg: req.flash('msg'),
  });
});

// halaman details data siswa
routes.get('/siswa/detail/:nama', (req, res) => {
  // function untuk mengambil data 1 siswa
  const student = findStudent(req.params.nama);

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
routes.get('/siswa/delete/:nama', (req, res) => {
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
routes.get('/siswa/edit/:nama', (req, res) => {
  const dataSiswa = findStudent(req.params.nama);

  res.render('edit-siswa', {
    title: 'Form Edit Siswa',
    dataSiswa,
  });
});

// memproses data dari form edit-siswa.ejs
routes.post(
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

module.exports = routes;
