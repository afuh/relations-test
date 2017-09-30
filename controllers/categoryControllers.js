const Image = require('../models/Image');

exports.getCategories = async (req, res) => {
  const categories = await Image.getCategoriesList()

  res.json({categories})
}

exports.getCategory = async (req, res) => {
  const catsQuery = req.params.name || { $exists: true }

  const catsPromise = Image.getCategoriesList()
  const imagesPromise = Image.find({ categories: catsQuery }).populate('comments');

  const [categories, images] = await Promise.all([catsPromise, imagesPromise])

  res.json({categories, images})
}
