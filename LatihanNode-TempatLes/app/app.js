const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// import routes dari folder /routes
const routes = require('../routes/routes');

const app = express();
const port = 3000;

// konfigurasi ejs
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// build-in middleware untuk parse data yang dikirim
// digunakan ke setiap middleware
app.use(express.urlencoded({ extended: true }));

// konfigurasi pesan flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// routes setiap halaman
app.use(routes);

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}, http://localhost:${port}`);
});
