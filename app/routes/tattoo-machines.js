const express = require('express')
const {
  getSingleTattooMachine,
  getAllTattooMachines,
  getRelated,
  getSearchedTattooMachines
} = require("../controllers/tattoo-machine.js");
const router = express.Router()

router.route('/')
  .get(getAllTattooMachines)

router.route('/search')
  .get(getSearchedTattooMachines)

router.route('/:id')
  .get(getSingleTattooMachine)

router.route('/:id/related')
  .get(getRelated)


module.exports = router