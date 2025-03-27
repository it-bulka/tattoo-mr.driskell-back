const express = require('express')
const {
  getOrderById,
  getAllOrders
} = require("../controllers/order");
const router = express.Router()

router.route('/').get(getAllOrders)
router.route('/:id').get(getOrderById)

module.exports = router