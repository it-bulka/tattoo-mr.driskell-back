const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LONG })
}

const isTokenValid = (token, secret = process.env.JWT_ACCESS_SECRET) => {
  return jwt.verify(token, secret)
}

const REFRESH_TOKEN_COOKIES_NAME = 'refreshToken'
const attachCookiesToRes = ({ res, refreshToken, expiresAt }) => {
  res.cookie(REFRESH_TOKEN_COOKIES_NAME, refreshToken, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: process.env.NODE_ENV === 'production'
  })
}

const clearCookiesToken = (res) => {
  res.cookie(REFRESH_TOKEN_COOKIES_NAME, '', { expires: new Date(Date.now())})
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToRes,
  clearCookiesToken
}