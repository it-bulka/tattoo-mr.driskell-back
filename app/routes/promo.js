const express = require('express')
const router = express.Router()
const { promoCodeActivate } = require('../controllers/promo')

router.route('/activate')
  .post(promoCodeActivate)

module.exports = router