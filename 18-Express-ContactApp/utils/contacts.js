const fs = require('fs');

// membuat folder data user jika belum ada
const folderPath = './data';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// membuat file data contact user jika belum ada
const filePath = './data/siswa.json';
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// mengambil data pada siswa.json
const storeData = () => {
  const file = fs.readFileSync('./data/siswa.json', 'utf-8');
  const banyakSiswa = JSON.parse(file);
  return banyakSiswa;
};

// menimpa isi file pada siswa.json
const saveData = (banyakSiswa) => {
  fs.writeFileSync('./data/siswa.json', JSON.stringify(banyakSiswa));
};

// menambahkan data yang dikirim lewat form
const tambahSiswa = (siswa) => {
  const banyakSiswa = storeData();
  banyakSiswa.push(siswa);
  saveData(banyakSiswa);
};

const cekDuplikat = (nama) => {
  const banyakSiswa = storeData();
  return banyakSiswa.find((siswa) => siswa.nama === nama);
};

module.exports = { storeData, tambahSiswa, cekDuplikat };
