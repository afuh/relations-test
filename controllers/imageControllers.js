const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');

const Image = require('../models/Image');


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
  //rename
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(600, jimp.AUTO).quality(70);
  await photo.write(`./public/uploads/gallery/${req.body.photo}`);

  await photo.cover(290, 290, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE);
  await photo.write(`./public/uploads/thumbs/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;

  const image = await (new Image(req.body)).save();
  console.log('You have shared a new image')

  res.redirect(`back`);
}

exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image }).populate('author comments')

  if (!image) return res.json({message: 'no existe'})

  res.render('image', { title: image.caption, image });
}
