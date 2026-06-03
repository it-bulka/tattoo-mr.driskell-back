const express = require('express')
const router = express.Router()
const {
  getAllDiscounts,
  getActiveDiscountsHandler,
  createDiscount,
  updateDiscount,
  deactivateDiscount
} = require('../controllers/discount')

router.get('/', getAllDiscounts)
router.get('/active', getActiveDiscountsHandler)
router.post('/', createDiscount)
router.patch('/:id', updateDiscount)
router.delete('/:id', deactivateDiscount)

module.exports = router
