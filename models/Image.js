const mongoose = require('mongoose');
const striptags = require('striptags');

const imageSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true
  },
  url: String,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [String]
}, {
  toJSON: { virtuals: true }
});

imageSchema.pre('save', function(next){
  this.caption = striptags(this.caption);
  next();
});

imageSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'image'
});

imageSchema.statics.getCategoriesList = function() {
  return this.aggregate([
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
    { $sort: { count: -1 }}
  ]);
}

module.exports = mongoose.model('Image', imageSchema);
