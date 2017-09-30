const Image = require('../models/Image');

const { ui } = require('../handlers/helpers')

// the method .getCategoriesList() is a static method created in the Image Schema,
// which is in charge of search, sort and display categories.
exports.getCategory = async (req, res) => {
  const category = req.params.name
  const catsQuery = category || { $exists: true }

  const catsPromise = Image.getCategoriesList()
  const imagesPromise = Image.find({ categories: catsQuery }).populate('comments')

  const [categories, images] = await Promise.all([catsPromise, imagesPromise])

  if (ui) {
    res.render('categories', { title: 'categories', category, categories, images });
  }
  else {
    res.json({categories, images})
  }
}
