const { getTattooMachineById, getTattooMachines } = require("../sevices/tattoo-machine")
const { BadRequest } = require("../errors")
const { StatusCodes } = require('http-status-codes')

const getSingleTattooMachine = async (req, res) => {
  const tattooMachineId = req.params.id
  const lang = req.lang

  const machine = await getTattooMachineById(tattooMachineId, lang)

  if (!machine) {
    throw new BadRequest(`Tattoo machine with id ${tattooMachineId} not found`)
  }

  res.status(StatusCodes.OK).json(machine)
}

const getAllTattooMachines = async (req, res) => {
  const machines = await getTattooMachines({}, req.lang)

  if (!machines) {
    throw new BadRequest(`Tattoo machines not found`)
  }

  res.status(StatusCodes.OK).json(machines)
}



module.exports = {
  getSingleTattooMachine,
  getAllTattooMachines
}