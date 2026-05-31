const path = require('path')
const fs = require('fs')
const { TattooMachine} = require('../../app/models/tattoo-machine')
const { generate } = require('./generate-tattoo-machine')

const populateTattooMachine = async () => {
  await TattooMachine.deleteMany({})
  await generate()

  const generatedFilePath = path.join(__dirname, 'tattooMachines.json');
  if (fs.existsSync(generatedFilePath)) {
    const tattooMachineData = JSON.parse(fs.readFileSync(generatedFilePath, 'utf-8'));

    const machinesFc = tattooMachineData.map(async machine => {
      const tattooMachine = new TattooMachine(machine)
      tattooMachine.$locals.translations = machine.translations
      await tattooMachine.save()
    })

    await Promise.all(machinesFc)
  }
}

module.exports = {
  populateTattooMachine
}