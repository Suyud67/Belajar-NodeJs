const http = require('http');
const fs = require('fs');

const renderHtml = (path, res) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.write('File Not Found');
    } else {
      res.write(data);
    }
    res.end();
  });
};

const server = http.createServer((req, res) => {
  const { url } = req;

  res.writeHead(200, {
    'Content-Type': 'text/html',
  });

  //menggunakan if else
  //   if (url === '/about') {
  //     res.write('<h1>Halo ini menu about!</h1>');
  //     res.end();
  //   } else {
  //     res.write('<h1>Hallo ini main menu</h1>');
  //     res.end();
  //   }

  // menggunakan switch case
  switch (url) {
    case '/about':
      renderHtml('./about.html', res);
      break;
    case '/detail':
      renderHtml('./detail.html', res);
      break;
    default:
      res.write('<h1>Hello ini menu utama</h1>');
      res.end();
      break;
  }
});

const port = 3000;
const hostname = 'localhost';

server.listen(port, hostname, () => {
  console.log(`server http://${hostname}:${port} is running!`);
});
