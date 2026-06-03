const express = require('express')
const { getAllBrands } = require('../controllers/brands')
const router = express.Router()

router.route('/').get(getAllBrands)

module.exports = router
