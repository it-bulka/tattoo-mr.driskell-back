const express = require('express')
const {
  getOrderById,
  getAllOrders,
  createUserOrder
} = require("../controllers/order");
const router = express.Router()

router.route('/')
  .get(getAllOrders)
  .post(createUserOrder)
router.route('/:id').get(getOrderById)

module.exports = router