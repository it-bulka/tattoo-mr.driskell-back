const express = require('express')
const router = express.Router()
const {
  register,
  login,
  verifyEmail,
  logout
} = require('../controllers/auth')

router.route('/register').post(register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)
router.get('/logout', logout)

module.exports = router