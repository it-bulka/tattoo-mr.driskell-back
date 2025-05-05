const express = require('express')
const router = express.Router()
const {
  setFavourite,
  getAllFavouriteByUser,
  deleteFavourite,
  getAllFavouriteIdsByUser,
  batchFavourite
} = require('../controllers/favourite')

router.route('/')
  .post(getAllFavouriteByUser)

router.route('/ids')
  .post(getAllFavouriteIdsByUser)

router.route('/batching')
  .post(batchFavourite)

router.route('/:id')
  .delete(deleteFavourite)
  .post(setFavourite)


module.exports = router