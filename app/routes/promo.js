const express = require('express')
const router = express.Router()
const { promoCodeActivate, getPromoCodes } = require('../controllers/promo')

router.route('/').get(getPromoCodes)
router.route('/activate').post(promoCodeActivate)

module.exports = router