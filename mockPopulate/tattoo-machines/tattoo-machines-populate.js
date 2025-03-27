const tattooMachineData = require('./tattoo-machines.json')
const { TattooMachine} = require('../../app/models/tattoo-machine')

const populateTattooMachine = async () => {
  await TattooMachine.deleteMany({})

  const machinesFc = tattooMachineData.map(async machine => {
    const tattooMachine = new TattooMachine(machine)
    tattooMachine.$locals.translations = machine.translations
    await tattooMachine.save()
  })

  await Promise.all(machinesFc)
}

module.exports = {
  populateTattooMachine
}