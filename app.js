/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')

const app = express();
const routes = require('./routes');

require('./handlers/passport.js');
require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true,
  promiseLibary: global.Promise
});

mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

app.use(session({ secret: "evil morty", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes);

app.use((req, res) => {
  res.status(404).send({
    url: req.originalUrl + ' not found'
  })
});

app.listen(process.env.PORT, () => console.log('\x1b[33m%s\x1b[0m', `Express running → PORT ${process.env.PORT}`))
