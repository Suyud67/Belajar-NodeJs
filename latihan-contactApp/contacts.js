const fs = require('fs');
const chalk = require('chalk');
const validator = require('validator');

// membuat folder data user jika belum ada
const folderPath = './data';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// membuat file data contact user jika belum ada
const filePath = './data/contacts.json';
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

const simpanData = () => {
  const file = fs.readFileSync('./data/contacts.json', 'utf-8');
  const banyakSiswa = JSON.parse(file);
  return banyakSiswa;
};

const simpanContact = (nama, email, alamat) => {
  const data = { nama, email, alamat };

  // const file = fs.readFileSync('./data/contacts.json', 'utf-8');
  // const contacts = JSON.parse(file);

  const banyakSiswa = simpanData();

  const duplikatData = banyakSiswa.find((contact) => contact.nama === nama);

  // duplikat data nama
  if (duplikatData) {
    console.log(chalk.bgRedBright.white('Data sudah terdaftar, mohon ganti nama baru!'));
    return false;
  }

  // cek email
  if (email) {
    if (!validator.isEmail(email)) {
      console.log(chalk.bgRedBright.white('Format email salah, mohon perbaiki kembali!'));
      return false;
    }
  }

  banyakSiswa.push(data);

  fs.writeFileSync('./data/contacts.json', JSON.stringify(banyakSiswa, null, 2));
  console.log(chalk.green.inverse.bold('Data berhasil disimpan'));
};

const tampilkanList = () => {
  const banyakSiswa = simpanData();
  console.log(chalk.bgWhiteBright.black('Daftar List Siswa: '));
  banyakSiswa.map((contact, i) => {
    console.log(`${i + 1}. ${contact.nama} - ${contact.alamat}`);
  });
};

const detailSiswa = (nama) => {
  const banyakSiswa = simpanData();

  const siswa = banyakSiswa.find((siswa) => siswa.nama.toLowerCase() === nama.toLowerCase());

  if (!siswa) {
    console.log(chalk.bgRedBright.white('Nama tidak ditemukan'));
    return false;
  }

  console.log(chalk.bgWhiteBright.black(`Detail Siswa ${siswa.nama}: `));
  console.log(`Alamat Siswa: ${siswa.alamat}`);
  if (siswa.email) {
    console.log(`Email Siswa: ${siswa.email}`);
  }
};

const hapusSiswa = (nama) => {
  const banyakSiswa = simpanData();

  const indexSiswa = banyakSiswa.findIndex((siswa) => siswa.nama.toLowerCase() === nama.toLowerCase());
  banyakSiswa.splice(indexSiswa, 1);

  fs.writeFileSync('./data/contacts.json', JSON.stringify(banyakSiswa, null, 2));
  console.log(chalk.green.inverse.bold('Data siswa berhasil disimpan'));
};

module.exports = { simpanContact, tampilkanList, detailSiswa, hapusSiswa };
