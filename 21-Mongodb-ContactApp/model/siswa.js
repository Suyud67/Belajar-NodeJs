const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// struktur data menggunakan Schema
const studentSchema = new Schema({
  nama: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  alamat: {
    type: String,
    require: true,
  },
});

// ketika struktur data sudah ditentukan maka akan dimasukkan ke tabel pada database menggunakan model
const Student = model('classone', studentSchema);

module.exports = Student;
