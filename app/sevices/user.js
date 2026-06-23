const User = require('../models/user')
const { Order, FavouriteMachine, Cart, Token } = require('../models')
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

const updateUser = async (userId, fields) => {
  const updateData = Object.fromEntries(
    Object.entries(fields).filter(([, v]) => v !== undefined)
  )
  if (Object.keys(updateData).length === 0) throw new BadRequest('Provide at least one field to update')

  try {
    const user = await User
      .findOneAndUpdate({ _id: userId }, updateData, { new: true, runValidators: true })
      .selectWithoutPassword()
    if (!user) throw new NotFound('User not found')
    return user
  } catch (err) {
    if (err.code === 11000) {
      const error = new BadRequest('Email already in use')
      error.field = 'email'
      throw error
    }
    throw err
  }
}

const deleteUser = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new NotFound('User not found')

  await Promise.all([
    Order.deleteMany({ userId }),
    FavouriteMachine.deleteMany({ userId }),
    Cart.deleteMany({ userId }),
    Token.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ])
}

module.exports = { updatePassword, updateUser, deleteUser }
