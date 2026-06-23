const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser,
} = require('../controllers/user')

const {
  createUserOrder,
  getAllOrdersByUser,
} = require("../controllers/order")

const {
  getAllFavouriteByUser
} = require("../controllers/favourite")

const { authenticate } = require('../middleware/authenticate')
const { adminOnly } = require('../middleware/admin-only')

router.use(authenticate)

router.route('/').get(adminOnly, getAllUsers)
router.route('/:id').get(getSingleUser).delete(deleteUser)
router.route('/:id/update').patch(updateUser)
router.route('/:id/update-password').patch(updateUserPassword)
router.route('/:userId/orders')
  .get(getAllOrdersByUser)
  .post(createUserOrder)
router.route('/:id/tattoo-machines/favourites')
  .get(getAllFavouriteByUser)


module.exports = router
