const express = require('express')
const {
  getSingleTattooMachine,
  getAllTattooMachines,
  getRelated
} = require("../controllers/tattoo-machine.js");
const router = express.Router()

router.route('/')
  .get(getAllTattooMachines)

router.route('/:id')
  .get(getSingleTattooMachine)

router.route('/:id/related')
  .get(getRelated)


module.exports = router