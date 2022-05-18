const http = require('http');

// *ketika server sudah siap maka function ini yang akan dijalankan untuk meresponse permintaan client
const requestListener = (request, response) => {
  // return response dalam bentuk  file apa
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('X-Powered-By', 'NodeJS');

  // * response code status di berikan secara manual sesuai req yang diminta user

  const { method, url } = request;
  //   pengecekan req yang dari kiriman client

  if (url === '/') {
    if (method === 'GET') {
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: 'ini adalah homepage!',
        })
      );
    } else {
      response.statusCode = 400;
      response.end(
        JSON.stringify({
          message: `halaman tidak bisa ditemukan dengan ${method} request`,
        })
      );
    }
  } else if (url === '/about') {
    if (method === 'GET') {
      response.statusCode = 200;
      response.end(
        JSON.stringify({
          message: 'ini adalah menu about!',
        })
      );
    } else if (method === 'POST') {
      let body = [];

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        body = Buffer.concat(body).toString();
        const { name } = JSON.parse(body);
        response.statusCode = 200;
        response.end(
          JSON.stringify({
            message: `halo ${name}, selamat datang di menu about`,
          })
        );
      });
    } else {
      response.statusCode = 400;
      response.end(
        JSON.stringify({
          message: `halaman about tidak bisa ditemukan dengan ${method} request`,
        })
      );
    }
  } else {
    response.statusCode = 404;
    response.end(
      JSON.stringify({
        message: 'Halaman Tidak Ditemukan',
      })
    );
  }
};

const server = http.createServer(requestListener);

// membuat server untuk diakses Client
const port = 5000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
