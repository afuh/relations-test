/* eslint-disable no-console */
require('dotenv').config({path: 'variables.env'});

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const app = express();
const routes = require('./routes')
const helpers = require('./handlers/helpers')

require('./handlers/passport.js');

mongoose.connect(process.env.DATABASE, { useMongoClient: true});
mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

mongoose.plugin(mongodbErrorHandler);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages (if we use them)
app.use(session({
  secret: "evil morty",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// We need this middlewear to use variables in our views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.h = helpers;
  next();
});

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes);

app.use(helpers.notFound);

if (app.get('env') === 'development') {
  app.use(helpers.developmentErrors);
}

app.use(helpers.productionErrors);

app.listen(process.env.PORT, () => console.log('\x1b[33m%s\x1b[0m', `Express running → PORT ${process.env.PORT}`))
