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
} = require("../controllers/order")

const {
  getAllFavouriteByUser
} = require("../controllers/favourite")

router.route('/').get(getAllUsers)
router.route('/:id').get(getSingleUser)
router.route('/:id/update').patch(updateUser)
router.route('/:id/update-password').patch(updateUserPassword)
router.route('/:userId/orders')
  .get(getAllOrdersByUser)
  .post(createUserOrder)
router.route('/:id/tattoo-machines/favourites')
  .get(getAllFavouriteByUser)


module.exports = router
