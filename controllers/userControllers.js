const User = require('../models/User');
const Image = require('../models/Image');

const { ui } = require('../handlers/helpers')

exports.showProfile = async (req, res) => {
  const profile = await User.findOne({ username: req.params.username })

  if (!profile) return res.json({message:  `${req.params.username} not found`})

  const images = await Image.find({ author: profile._id })
    .sort({ created: 'desc' })
    .limit(12)
    .populate('comments');

  if (ui) {
    res.render('profile', { title: profile.username, images, profile });
  }
  else {
    res.json({profile, images})
  }
}
