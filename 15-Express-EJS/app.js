const express = require('express');
const app = express();
const port = 3000;

// menggunakan ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { header: 'Halaman Utama' });
});

app.get('/detail', (req, res) => {
  res.render('detail', { detailHeader: 'Halaman Detail' });
});

app.get('/about', (req, res) => {
  res.render('about', { aboutHeader: 'Halaman About' });
});

app.get('/about/product/:nama', (req, res) => {
  res.send(`product dengan nama: ${req.params.nama} dan nama produknya adalah: ${req.query.jml}`);
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>Page Not Found!</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
