/* eslint-disable no-console */
require('dotenv').config({path: 'variables.env'});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const path = require('path');
const MongoStore = require('connect-mongo')(session);

const app = express();
const routes = require('./routes')
const helpers = require('./handlers/helpers')

require('./handlers/passport.js');

mongoose.connect(process.env.DATABASE, { useMongoClient: true});
mongoose.Promise = global.Promise

mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "evil morty",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.h = helpers;
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes);

app.use((req, res) => {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

app.listen(process.env.PORT, () => console.log('\x1b[33m%s\x1b[0m', `Express running → PORT ${process.env.PORT}`))
