const { Service } = require('../models/services')
const { NotFound } = require('../errors')

const getLocalizedService = async (serviceId, lang = "en") => {
  const service = await Service.findById(serviceId)
  if (!service) throw new NotFound("Service not found")

  return {
    name: service.name.get(lang) || service.name.get("en"),
    description: service.description.get(lang) || service.description.get("en"),
    type: service.type,
    value: service.value
  }
}

module.exports = {
  getLocalizedService,
}
