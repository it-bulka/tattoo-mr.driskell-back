const User = require("../models/user")
const { StatusCodes } = require("http-status-codes")
const {
  BadRequest,
  Unauthenticated
} = require("../errors")
const { registration: userRegistration, verifyUser } = require('../sevices/auth')
const { sendEmailVerification } = require('../utils/mail')
const uuid = require('uuid')
const { issueTokensForUser } = require('../sevices')
const { getDeviceIdHeader, deleteToken } = require("../sevices/token")
const { getUserOTD } = require('../utils')
const { clearCookiesToken } = require('../utils/jwt')

const register = async (req, res) => {
  const { name, email, password } = req.body

  const verificationToken = uuid.v4()
  await userRegistration({
    name,
    email,
    password,
    verificationToken
  })

  await sendEmailVerification({
    email,
    verificationToken,
    origin: process.env.CLIENT_ORIGIN
  })

  return res.status(StatusCodes.OK).send()
}

const login = async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
    throw new BadRequest('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if(!user) {
    throw new Unauthenticated('No credential')
  }

  const isPasswordMatch = user.comparePassword(password)
  if(!isPasswordMatch) {
    throw new Unauthenticated('Password not valid')
  }

  const deviceId = getDeviceIdHeader({ req })
  const { accessToken } = await issueTokensForUser({ res, deviceId, user })

  res.status(StatusCodes.OK).json({ data: getUserOTD(user), accessToken, success: true })
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body
  if(!email || !verificationToken) {
    throw new BadRequest('Please provide email and verificationToken')
  }
  const deviceId = getDeviceIdHeader({ req })

  const user = await verifyUser({ email, verificationToken })
  const { accessToken } = await issueTokensForUser({ res, deviceId, user })

  return res.status(StatusCodes.OK).json({ data: getUserOTD(user), accessToken, success: true })
}

const logout = async (req, res) => {
  const { userId } = req.query
  const deviceId = req.headers['device-id']

  await deleteToken({ deviceId, userId })
  await clearCookiesToken(res)

  return res.status(StatusCodes.OK).send()
}

module.exports = {
  register,
  login,
  verifyEmail,
  logout
}