require('dotenv').config({path: 'variables.env'});

// Passport set up

const passport = require('passport');
const { site } = require('./helpers');

const User = require('../models/User');

const GitHubStrategy = require('passport-github2').Strategy;
const ghSettings = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${site}/gh`
}

passport.use(new GitHubStrategy(ghSettings, (accessToken, refreshToken, profile, done) => {

  const { name, login, avatar_url, html_url, blog } = profile._json
  const user = {
    name,
    username: login,
    avatar_url,
    github_url: html_url,
    website: blog
  }

  User.findOrCreate(user)
    .then(res => done(null, res.doc))
    .catch(err => done(err))
}))

passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((obj, done) => { done(null, obj) });
