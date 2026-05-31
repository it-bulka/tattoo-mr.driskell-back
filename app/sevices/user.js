const User = require('../models/user')
const { BadRequest, NotFound } = require('../errors')

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId)
  if (!user) throw new NotFound('User not found')

  if (!newPassword) throw new BadRequest('New password is required')

  const isMatch = oldPassword ? await user.comparePassword(oldPassword) : false
  if (!isMatch) throw new BadRequest('Current password is incorrect')

  user.password = newPassword
  await user.save()
}

module.exports = { updatePassword }
