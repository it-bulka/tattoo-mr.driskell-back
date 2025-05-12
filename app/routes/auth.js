const express = require('express')
const router = express.Router()
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout
} = require('../controllers/auth')

router.route('/register').post(register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/logout', logout)

module.exports = router