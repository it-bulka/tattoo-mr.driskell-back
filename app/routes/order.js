const express = require('express')
const {
  getOrderById,
  getAllOrders,
  createUserOrder,
  wayforpayCallback,
} = require("../controllers/order");
const router = express.Router()

router.route('/wayforpay/callback').post(wayforpayCallback)
router.route('/').get(getAllOrders).post(createUserOrder)
router.route('/:id').get(getOrderById)

module.exports = router