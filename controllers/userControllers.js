const User = require('../models/User');
const Image = require('../models/Image');

const { ui, site } = require('../handlers/helpers')

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

exports.showProfiles = async (req, res) => {
  const profiles = await User.find().sort({ created: 'desc' }).limit(12)

  const error = { message: "Please login. Go to /login"}
  const success = {
    message: `Hi ${req.user && req.user.name}. If you want to see your profile go to /${req.user && req.user.username} `,
    users: profiles.map(p => `${site}/${p.username}`)
  }

  if (ui) {
    res.render('home', { title: 'Home', profiles, success });
  }
  else {
    res.json(!req.user ? error : success)
  }
}
