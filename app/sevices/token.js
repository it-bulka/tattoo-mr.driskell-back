const { Token } = require("../models")
const { Unauthenticated, BadRequest } = require("../errors")
const { createJWT, attachCookiesToRes } =  require('../utils/jwt')
const jwt = require("jsonwebtoken")
const { createTokenPayload } = require("../utils");

const refreshExpiresAt = () => {
  const now = new Date()
  const millisecondsIn30Days = 30 * 24 * 60 * 60 * 1000;
  const expiresAt = now + millisecondsIn30Days

  return new Date(expiresAt)
}

const generateTokens = ({ userId, name, email, deviceId }) => {
  const payload = { userId, name, email, deviceId }

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30min' })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_LONG })
  return {
    accessToken,
    refreshToken
  }
}

const saveRefreshToken = async ({ userId, deviceId, refreshToken }) => {
  const existedToken = await Token.findOne({ user: userId, deviceId })

  if(existedToken) {
    const { isValid } = existedToken
    if(!isValid) {
      throw Unauthenticated('Invalid Credentials')
    }

    existedToken.refreshToken = refreshToken
    return await existedToken.save()
  }

  const token = await Token.create({
    user: userId,
    deviceId,
    refreshToken,
    expiresAt: refreshExpiresAt()
  })

  return token
}

const getDeviceIdHeader = ({  req }) => {
  const deviceId = req.headers['device-id']

  if (!deviceId) {
    throw new BadRequest('Device id is required')
  }

  return deviceId
}

const issueTokensForUser = async ({ res, user, deviceId }) => {
  const tokenPayload = createTokenPayload(user, deviceId)
  const tokens = generateTokens(tokenPayload)

  const refreshToken = await saveRefreshToken({
    userId: user._id,
    deviceId,
    refreshToken: tokens.refreshToken
  })

  await attachCookiesToRes({
    res,
    refreshToken: refreshToken.refreshToken,
    expiresAt: refreshToken.expiresAt
  })

  return tokens
}

module.exports = {
  generateTokens,
  saveRefreshToken,
  getDeviceIdHeader,
  issueTokensForUser
}