const Image = require('../models/Image');

// the method .getCategoriesList() is a static method created in the Image Schema,
// which is in charge of search, sort and display categories.
exports.getCategories = async (req, res) => {
  const categories = await Image.getCategoriesList()

  res.json({categories})
}

exports.getCategory = async (req, res) => {
  const catsQuery = req.params.name || { $exists: true }

  const catsPromise = Image.getCategoriesList()
  const imagesPromise = Image.find({ categories: catsQuery })
    // .populate('comments');

  const [categories, images] = await Promise.all([catsPromise, imagesPromise])

  res.json({categories, images})
}
