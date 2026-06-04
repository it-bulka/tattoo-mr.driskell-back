const express = require('express')
const {
  getOrderById,
  getAllOrders,
  createUserOrder,
  wayforpayCallback,
} = require("../controllers/order");
const { authenticate } = require('../middleware/authenticate')
const { adminOnly } = require('../middleware/admin-only')
const router = express.Router()

router.route('/wayforpay/callback').post(wayforpayCallback)
router.route('/').get(authenticate, adminOnly, getAllOrders).post(createUserOrder)
router.route('/:id').get(getOrderById)

module.exports = router