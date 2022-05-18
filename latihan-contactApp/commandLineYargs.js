const yargs = require('yargs');

// yargs.command(
//   'add',
//   'menambahkan contact baru',
//   () => {},
//   (argv) => {
//     console.log(argv);
//   }
// );

yargs.command({
  command: 'add',
  describe: 'Menambahkan siswa baru',
  builder: {
    nama: {
      describe: 'Nama Lengkap Siswa',
      demandOption: true,
      type: 'string',
    },
    mapelFav: {
      describe: 'Mata pelajaran favorite siswa',
      demandOption: false,
      type: 'string',
    },
    alamat: {
      describe: 'Alamat siswa',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const dataSiswa = {
      nama: argv.nama,
      mapelFavorite: argv.mapelFav,
      alamat: argv.alamat,
    };
    console.log(dataSiswa);
  },
});

yargs.parse();
