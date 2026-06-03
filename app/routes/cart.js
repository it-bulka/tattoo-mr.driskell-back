const express = require('express')
const router = express.Router()
const { getCart, updateCart, calculateCartController } = require('../controllers/cart')

router.get('/', getCart)
router.post('/sync', updateCart)
router.post('/calculate', calculateCartController)

module.exports = router