const express = require('express')
const router = express.Router()
const { getCart, updateCart } = require('../controllers/cart')

router.route('/')
  .get(getCart)

router.route('/sync')
  .post(updateCart)

module.exports = router