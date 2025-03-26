const express = require('express')
const { getSingleTattooMachine, getAllTattooMachines } = require("../controllers/tattoo-machine.js");
const router = express.Router()

router.route('/')
  .get(getAllTattooMachines)

router.route('/:id')
  .get(getSingleTattooMachine)


module.exports = router