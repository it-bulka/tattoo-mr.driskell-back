const servicesData = require('./services.json')
const { Service } = require('../../app/models/services')

const populateService = async () => {
  await Service.deleteMany({})
  await Service.create(servicesData)
}

module.exports = {
  populateService
}