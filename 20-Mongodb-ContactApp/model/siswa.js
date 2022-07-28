const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// struktur data menggunakan Schema
const studentSchema = new Schema({
  nama: {
    type: String,
    require: true,
  },
  noHp: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

// ketika struktur data sudah ditentukan maka akan dimasukkan ke tabel pada database menggunakan model
const Student = model('classCemara', studentSchema);

module.exports = Student;
