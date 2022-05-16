// Core Module
// File System

const fs = require('fs');

// menuliskan string ke file (synchronous)
// try {
//   fs.writeFileSync('file.txt', 'hello world');
// } catch (error) {
//   console.log(error);
// }

// menuliskan string ke file (asynchronous)
// fs.writeFile('file.txt', 'membaca file secara Asynchronous', (e) => {
//   console.log(e);
// });

// membaca isi file (synchronous)
// const data = fs.readFileSync('file.txt', 'utf-8');

// console.log(data);

// membaca isi file (synchronous)
// fs.readFile('file.txt', 'utf-8', (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// Readline
const readline = require('readline');

const rl = readline.Interface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Masukan Nama Anda: ', (nama) => {
  rl.question('Masukan Nomer Hp: ', (noHp) => {
    const data = { nama, noHp };

    const file = fs.readFileSync('data.json', 'utf-8');
    const contacts = JSON.parse(file);

    contacts.push(data);

    fs.writeFileSync('data.json', JSON.stringify(contacts, null, 2));
    console.log('terima kasih');

    rl.close();
  });
});
