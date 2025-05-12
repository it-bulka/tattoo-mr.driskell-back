const express = require('express')
const router = express.Router()
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken
} = require('../controllers/auth')

router.route('/register').post(register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/refresh-token', refreshToken)
router.get('/logout', logout)

module.exports = router