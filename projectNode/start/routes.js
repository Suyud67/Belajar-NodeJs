const { addNoteHandler, getAllNotesHandler, getNoteById, editNoteByIdHandler, deleteNoteByIdHandler } = require('./handler');

const routes = [
  {
    // routes untuk menambahkan note
    method: 'POST',
    path: '/notes',
    handler: addNoteHandler,
  },
  {
    // route untuk mendapatkan dan menampilkan note
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler,
  },
  {
    // route untuk mendapatkan detail note
    method: 'GET',
    path: '/notes/{id}',
    handler: getNoteById,
  },
  {
    // route untuk mengedit atau merubah note
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNoteByIdHandler,
  },
  {
    // route untuk mengedit atau merubah note
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteByIdHandler,
  },
];

module.exports = routes;
