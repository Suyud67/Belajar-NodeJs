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
  const students = JSON.parse(file);
  return students;
};

// menimpa isi file pada siswa.json
const saveData = (banyakSiswa) => {
  fs.writeFileSync('./data/siswa.json', JSON.stringify(banyakSiswa, null, 2));
};

// menambahkan data yang dikirim lewat form
const tambahSiswa = (siswa) => {
  const students = storeData();
  students.push(siswa);
  saveData(students);
};

const cekDuplikat = (nama) => {
  const students = storeData();
  return students.find((siswa) => siswa.nama === nama);
};

// mencari siswa berdasarkan nama
const findSiswa = (nama) => {
  const students = storeData();

  const student = students.find((student) => student.nama === nama);
  return student;
};

// const delete siswa
const deleteSiswa = (siswa) => {
  const students = storeData();

  const indexSiswa = students.findIndex((student) => student.nama.toLowerCase() === siswa.nama.toLowerCase());
  students.splice(indexSiswa, 1);

  saveData(students);
};

// mengubah dataSiswa
const updateStudents = (newStudent) => {
  const students = storeData();

  // menghilangkan siswa berdasarkan property oldNama dan nama
  const filteredSiswa = students.filter((student) => student.nama !== newStudent.oldName);

  // menghapus property oldName di obj newStudent
  delete newStudent.oldName;

  // push obj newStudent ke filteredSiswa
  filteredSiswa.push(newStudent);
  saveData(filteredSiswa); // save data
};

module.exports = { storeData, tambahSiswa, cekDuplikat, findSiswa, deleteSiswa, updateStudents };
