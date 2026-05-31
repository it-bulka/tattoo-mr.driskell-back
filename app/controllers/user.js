const User = require(`../models/user.js`)
const { StatusCodes } = require('http-status-codes')
const { NotFound, BadRequest } = require("../errors")
const { toUserDto } = require('../utils')
const { updatePassword, updateUser: updateUserService } = require('../sevices/user')

const getAllUsers = async (req, res) => {
  const users = await User.find().selectWithoutPassword()
  res.status(StatusCodes.OK).json({ data: users.map(toUserDto), success: "success" })
}

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).selectWithoutPassword()

  if (!user) {
    throw new NotFound('User not found')
  }

  // TODO: add check permission
  res.status(StatusCodes.OK).json({ data: toUserDto(user), success: "success" })
}

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.params.id).selectWithoutPassword()

  if (!user) {
    throw new NotFound('User not found')
  }

  res.status(StatusCodes.OK).json({ data: toUserDto(user), success: "success" })
}

const updateUser = async (req, res) => {
  const { name, email, phone, city, street, apartment, entrance, floor, doorphone } = req.body
  const user = await updateUserService(req.params.id, { name, email, phone, city, street, apartment, entrance, floor, doorphone })
  res.status(StatusCodes.OK).json({ data: toUserDto(user), success: 'success' })
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  await updatePassword(req.params.id, oldPassword, newPassword)
  res.status(StatusCodes.OK).json({ message: 'Password updated', success: 'success' })
}


module.exports = {
  getSingleUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  updateUserPassword
}