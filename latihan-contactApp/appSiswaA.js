const yargs = require('yargs');
const { simpanContact, tampilkanList, detailSiswa, hapusSiswa } = require('./contacts');

yargs
  .command({
    command: 'add',
    describe: 'menambahkan siswa kelas A',
    builder: {
      nama: {
        describe: 'nama siswa',
        demandOption: true,
        type: 'string',
      },
      email: {
        describe: 'email siswa',
        demandOption: false,
        type: 'string',
      },
      alamat: {
        describe: 'alamat siswa',
        demandOption: true,
        type: 'string',
      },
    },
    handler: function (argv) {
      simpanContact(argv.nama, argv.email, argv.alamat);
    },
  })
  .demandCommand();

// menampilkan data
yargs.command({
  command: 'list',
  describe: 'menampilkan list semua data siswa',
  handler() {
    tampilkanList();
  },
});

// menampilkan detail siswa
yargs.command({
  command: 'detail',
  describe: 'menampilkan detail siswa berdasarkan nama',
  builder: {
    nama: {
      describe: 'nama siswa',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    detailSiswa(argv.nama);
  },
});

// menghapus siswa berdasarkan nama
yargs.command({
  command: 'delete',
  describe: 'menghapus siswa berdasarkan nama',
  builder: {
    nama: {
      describe: 'nama siswa',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    hapusSiswa(argv.nama);
  },
});

yargs.parse();
