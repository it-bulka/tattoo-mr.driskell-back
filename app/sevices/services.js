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

const getAllServices = async (lang = "en") => {
  const services = await Service.find({ status: 'active' }).lean()
  return services.map(s => ({
    _id: s._id,
    name: s.name[lang] || s.name["en"],
    description: s.description[lang] || s.description["en"],
    type: s.type,
    value: s.value,
    currency: s.currency,
  }))
}

module.exports = {
  getLocalizedService,
  getAllServices,
}
