const express = require('express')
const router = express.Router()
const {
  register,
  login,
  verifyEmail
} = require('../controllers/auth')

router.route('/register').post(register)
router.post('/login', login)
router.post('/verify-email', verifyEmail)

module.exports = router