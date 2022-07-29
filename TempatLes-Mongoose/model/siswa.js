const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studentSchema = new Schema({
  nama: {
    type: String,
    require: true,
  },
  umur: {
    type: String,
    require: true,
  },
  hobi: {
    type: String,
    require: true,
  },
  sekolah: {
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
  alasanLes: {
    type: String,
    require: true,
  },
});

const Students = model('lespertama', studentSchema);

module.exports = Students;
