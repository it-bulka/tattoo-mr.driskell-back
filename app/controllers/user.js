const User = require(`../models/user.js`)
const { StatusCodes } = require('http-status-codes')
const { NotFound, BadRequest } = require("../errors")

const getAllUsers = async (req, res) => {
  const users = await User.find().selectWithoutPassword()
  res.status(StatusCodes.OK).json({ data: users, success: "success" })
}

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).selectWithoutPassword()

  if (!user) {
    throw new NotFound('User not found')
  }

  // TODO: add check permission
  res.status(StatusCodes.OK).json({ data: user, success: "success" })
}

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.params.id).selectWithoutPassword()

  if (!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ data: user, success: "success" })
}

const updateUser = async (req, res) => {
  const { name, email } = req.body

  const updatedFields = {}

  if(name) {
    updatedFields.name = name
  }

  if(email) {
    updatedFields.email = email
  }

  const user = await User
    .findOneAndUpdate({ _id: req.params.id }, updatedFields, { new: true, runValidators: true })
    .selectWithoutPassword()

  if(!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ data: user, success: "success" })
}

const updateUserPassword = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    throw new NotFound('User not found')
  }

  const { oldPassword, newPassword } = req.body
  if(!oldPassword || !newPassword) {
    throw new BadRequest('Provide both value: new and old password')
  }

  const isOldPasswordMatch = user.comparePassword(oldPassword)
  if(!isOldPasswordMatch) {
    throw new BadRequest('Initial password is not correct')
  }

  user.password = newPassword
  user.save()

  res.status(StatusCodes.OK).json({ message: 'Password updated', success: "success" })
}


module.exports = {
  getSingleUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  updateUserPassword
}