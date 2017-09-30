const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

// This Model will be populated by GitHub
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

// findOrCreate() method plugin to use it with the Passport
// http://mongoosejs.com/docs/plugins.html
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
