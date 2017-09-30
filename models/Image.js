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

// Statics methods are simple ways of adding functions to our Schemas.
// Do NOT use ES6 arrow functions when you create statics.
// Arrow functions prevent binding "this".
// http://mongoosejs.com/docs/guide.html#statics
imageSchema.statics.getCategoriesList = function() {
  // We create a static method which return a complex query.
  // In our case we want to search for categories and to know
  // how many images are 'inside' of each category.
  // For that we use the MongoDB's Aggregation Framework.
  // https://docs.mongodb.com/manual/aggregation/)
  // https://docs.mongodb.com/manual/reference/operator/aggregation/
  return this.aggregate([
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
    { $sort: { count: -1 }}
  ]);
}

// "Virtuals are document properties that you can get and set but that do not get persisted to MongoDB."
// http://mongoosejs.com/docs/guide.html#virtuals
// In this case I'm making a virtual conection between our Image model and the Image field in the Comment model.
imageSchema.virtual('comments', {
  ref: 'Comment', // what model to link?
  localField: '_id', // which field on the Image schema?
  foreignField: 'image' // which field on the Comment schema?
});


// Before we save the model to the DB, striptags is going to strip any HTML tags from the string.
// We use .pre() to define this method
// http://mongoosejs.com/docs/api.html#schema_Schema-pre
// Again, don't use Arrow Functions because we need the 'this' keyword
imageSchema.pre('save', function(next){
  this.caption = striptags(this.caption);
  next();
});


module.exports = mongoose.model('Image', imageSchema);
