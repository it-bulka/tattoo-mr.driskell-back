const express = require('express')
const router = express.Router()
const { getAllBundles, createBundle, updateBundle, deactivateBundle } = require('../controllers/bundle')

router.get('/', getAllBundles)
router.post('/', createBundle)
router.patch('/:id', updateBundle)
router.delete('/:id', deactivateBundle)

module.exports = router
