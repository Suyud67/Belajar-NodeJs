const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();

const port = 3000;

// import routes, db
const routes = require('./routes/routes');
require('./utils/db');

// set up ejs
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);

// set up pengolahan data
app.use(express.urlencoded({ extended: false }));

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

app.use(routes);

app.listen(port, () => console.log(`connected at port ${port}, http://localhost:${port}`));
