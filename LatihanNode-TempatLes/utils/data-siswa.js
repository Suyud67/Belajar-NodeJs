const fs = require('fs');

// membuat folder data jika belum ada
const folderPath = './data';
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// membuat file siswa.json jika belum ada
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

// save data user
const saveData = (students) => {
  fs.writeFileSync('./data/siswa.json', JSON.stringify(students, null, 2));
};

// mendapatkan detail data siswa berdasarkan dari nama yang dikirim melewati parameter
const findStudent = (siswa) => {
  const students = storeData();

  const dataSiswa = students.find((student) => student.nama.toLowerCase() === siswa.toLowerCase());

  return dataSiswa;
};

const cekDuplikat = (nama) => {
  const students = storeData();
  return students.find((student) => student.nama.toLowerCase() === nama.toLowerCase());
};

// menambah data siswa
const tambahSiswa = (student) => {
  const students = storeData();

  students.push(student);
  saveData(students);
};

// delete data siswa
const deleteStudent = (siswa) => {
  const students = storeData();

  // mencari index dari siswa yang dikirim melalui url
  const indexSiswa = students.findIndex((student) => student.nama.toLowerCase() === siswa.nama.toLowerCase());

  // menghapus data siswa menggunakan splice
  students.splice(indexSiswa, 1);

  saveData(students);
};

// update data siswa
const updateDataSiswa = (siswa) => {
  const students = storeData();

  // ngefilter data jika nama (json) dan namaLama (parameter) tidak sama
  // maka akan masuk ke var filteredSiswa
  const filteredSiswa = students.filter((student) => student.nama.toLowerCase() !== siswa.namaLama.toLowerCase());

  // menghapus properti namaLama pada data siswa (parameter)
  delete siswa.namaLama;

  // push data siswa (parameter) ke filteredSiswa
  // dan save
  filteredSiswa.push(siswa);
  saveData(filteredSiswa);
};

module.exports = { storeData, findStudent, cekDuplikat, tambahSiswa, deleteStudent, updateDataSiswa };
