const User = require(`../models/user.js`)
const { StatusCodes } = require('http-status-codes')
const { NotFound, BadRequest, Unauthorized } = require("../errors")
const { toUserDto } = require('../utils')
const { updatePassword, updateUser: updateUserService, deleteUser: deleteUserService } = require('../sevices/user')

const checkOwnUser = (req, paramKey = 'id') => {
  if (req.user.id !== req.params[paramKey] && req.user.role !== 'admin') {
    throw new Unauthorized('Access denied')
  }
}

const getAllUsers = async (req, res) => {
  const users = await User.find().selectWithoutPassword()
  res.status(StatusCodes.OK).json({ data: users.map(toUserDto), success: "success" })
}

const getSingleUser = async (req, res) => {
  checkOwnUser(req)
  const user = await User.findById(req.params.id).selectWithoutPassword()

  if (!user) {
    throw new NotFound('User not found')
  }

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
  checkOwnUser(req)
  const { name, email, phone, city, street, apartment, entrance, floor, doorphone } = req.body
  const user = await updateUserService(req.params.id, { name, email, phone, city, street, apartment, entrance, floor, doorphone })
  res.status(StatusCodes.OK).json({ data: toUserDto(user), success: 'success' })
}

const updateUserPassword = async (req, res) => {
  checkOwnUser(req)
  const { oldPassword, newPassword } = req.body
  await updatePassword(req.params.id, oldPassword, newPassword)
  res.status(StatusCodes.OK).json({ message: 'Password updated', success: 'success' })
}


const deleteUser = async (req, res) => {
  checkOwnUser(req)
  await deleteUserService(req.params.id)
  res.status(StatusCodes.OK).json({ message: 'Account deleted', success: 'success' })
}

module.exports = {
  getSingleUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
}