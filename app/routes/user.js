const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user')

const {
  createUserOrder,
  getAllOrdersByUser,
} = require("../controllers/order");

router.route('/').get(getAllUsers)
router.route('/:id').get(getSingleUser)
router.route('/:id/update').patch(updateUser)
router.route('/:id/update-password').patch(updateUserPassword)
router.route('/:userId/orders')
  .get(getAllOrdersByUser)
  .post(createUserOrder)

module.exports = router
