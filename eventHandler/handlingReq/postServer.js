const http = require('http');

// *ketika server sudah siap maka function ini yang akan dijalankan untuk meresponse permintaan client
const requestListener = (request, response) => {
  // return response dalam bentuk  file apa
  response.setHeader('Content-Type', 'text/html');
  //   response status
  response.statusCode = 200;

  //   pengecekan req yang dari kiriman client
  const { method } = request;

  if (method === 'GET') {
    response.end('<h1>HALO JOKO!</h1>');
  }
  if (method === 'POST') {
    let body = [];

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      body = Buffer.concat(body).toString();
      const { name } = JSON.parse(body);
      response.end(`<h1>Hai, ${name}!</h1>`);
    });
  }
};

const server = http.createServer(requestListener);

// membuat server untuk diakses Client
const port = 2000;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Server berjalan pada http://${host}:${port}`);
});
