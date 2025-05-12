const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG })
}

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookiesToRes = ({ res, refreshToken, expiresAt }) => {
  res.cookie('refreshToken', refreshToken, {
    expiresIn: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: process.env.NODE_ENV === 'production'
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes
}