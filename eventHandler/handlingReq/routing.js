const http = require('http');

// *ketika server sudah siap maka function ini yang akan dijalankan untuk meresponse permintaan client
const requestListener = (request, response) => {
  // return response dalam bentuk  file apa
  response.setHeader('Content-Type', 'text/html');
  //   response status
  response.statusCode = 200;

  const { method, url } = request;
  //   pengecekan req yang dari kiriman client

  if (url === '/') {
    if (method === 'GET') {
      response.end('<h1>ini adalah homepage</h1>');
    } else {
      response.end(`<h1>Halaman tidak dapat diakses oleh ${method} request</h1>`);
    }
  } else if (url === '/about') {
    if (method === 'GET') {
      response.end('<h1>Halo! ini adalah halaman about</h1>');
    } else if (method === 'POST') {
      let body = [];

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        body = Buffer.concat(body).toString();
        const { name } = JSON.parse(body);
        response.end(`<h1>Hai, ${name}! ini adalah menu about</h1>`);
      });
    } else {
      response.end(`<h1>Halaman about tidak dapat diakses oleh ${method} request</h1>`);
    }
  } else {
    response.end('Halaman tidak dapat ditemukan');
  }
};

const server = http.createServer(requestListener);

// membuat server untuk diakses Client
const port = 2000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
