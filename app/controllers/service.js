const { StatusCodes } = require('http-status-codes')
const { getAllServices } = require('../sevices/services')

const getServices = async (req, res) => {
  const lang = req.language || 'en'
  const services = await getAllServices(lang)
  res.status(StatusCodes.OK).json({ data: services })
}

module.exports = { getServices }
