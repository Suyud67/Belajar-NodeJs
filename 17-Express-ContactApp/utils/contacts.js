const fs = require('fs');

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

module.exports = { simpanData };
