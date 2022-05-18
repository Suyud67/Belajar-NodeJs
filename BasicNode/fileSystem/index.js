const fs = require('fs');

const checkData = (gagal, data) => {
  if (gagal) {
    console.log('data gagal didapatkan!');
    return false;
  }
  console.log(data);
};

fs.readFile('./fileSystem/note.txt', 'utf-8', checkData);
