const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  if (req.body.text.length > 140) return req.json({message: 'Apparently you have written too much, please try again'})

  // req.user depends on PassportJS.
  req.body.author = req.user._id
  req.body.image = req.params.image

  const comment = await new Comment(req.body).save()
  res.redirect('back')
}

exports.removeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  // If I'm not the author, I can't remove it.
  // This is a secure thing, the "remove" button won't show up in the client
  // unless I am the author.
  if (comment.author._id.toString() !== req.user._id.toString()) {
    res.json({message: `You can't remove that comment.`})
    return;
  }

  await comment.remove()
  res.redirect('back')
}
