const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');

const { ui } = require('../handlers/helpers')
const Image = require('../models/Image');

exports.showForm = (req, res) => {
  res.render('upload', {title: 'upload'})
}

// Multer is going to store the image in the memory
// Before save it to the disk we check the mime type
exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next ({ message: `That filetype isn't allowed!`}, false);
    }
  }
}).single('photo');

exports.resize = async (req, res, next) => {
  if (req.body.caption && req.body.caption.length > 140) {
    return res.json({ message: 'Upload failed, apparently you have written too much' })
  }
  // Use NodeJS Crypto to generate a random name
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  // Jimp is going to resize and write in our disk two images:
  // 1: A fixed square cover to use it in our gallery
  // 2: A resize of the original image aspect ratio
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(600, jimp.AUTO).quality(70);
  await photo.write(`./public/uploads/gallery/${req.body.photo}`);

  await photo.cover(290, 290, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
  await photo.write(`./public/uploads/thumbs/${req.body.photo}`);

  next();
}

// And save the image into the DB
exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;

  const image = await (new Image(req.body)).save();
  console.log('You have shared a new image')

  res.redirect(`back`);
}

// Both References (author) and Virtuals (comments) need to be
// populated, otherwise we won't see them.
// We can populate a filed in the controller define a default "pre populated" method direct in the model.
exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image }).populate('author comments')

  if (!image) return res.json({message: 'not found'})

  if (ui) {
    res.render('image', { title: image.caption, image });
  }
  else {
    res.json({image})
  }
}
