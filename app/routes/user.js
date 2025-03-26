const express = require('express')
const router = express.Router()

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword
} = require('../controllers/user')

router.route('/').get(getAllUsers)
router.route('/:id').get(getSingleUser)
router.route('/:id/update').patch(updateUser)
router.route('/:id/update-password').patch(updateUserPassword)

module.exports = router
