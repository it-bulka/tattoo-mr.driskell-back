const express = require('express')
const router = express.Router()
const {
  setFavourite,
  getAllFavouriteByUser,
  deleteFavourite
} = require('../controllers/favourite')

router.route('/')
  .get(getAllFavouriteByUser)

router.route('/:id')
  .delete(deleteFavourite)
  .post(setFavourite)


module.exports = router