const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

// Fetched from GH
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  avatar_url: String,
  github_url: String,
  website: String,
  created: {
    type: Date,
    default: Date.now
  }
});

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
