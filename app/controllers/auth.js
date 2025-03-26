const User = require("../models/user")
const StatusCode = require("http-status-codes")
const { BadRequest } = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body
  const isEmailExisted = await User.findOne({ email }).select('email')
  if (isEmailExisted) {
    throw new BadRequest("Email already exists")
  }

  // TODO: verify email
  const user = await User.create({
    name,
    email,
    password
  })

  res.status(StatusCode.OK).json({ user, success: true })
}

module.exports = {
  register
}