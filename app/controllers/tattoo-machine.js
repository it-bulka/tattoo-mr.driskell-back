const {
  getTattooMachineById,
  getTattooMachines,
  getCombo,
  getSameBrand,
  getSimilar,
  getRecommendedItems
} = require("../sevices/tattoo-machine")
const { BadRequest } = require("../errors")
const { StatusCodes } = require('http-status-codes')
const {
  tagsValidator,
  pageValidator,
  limitValidator,
  categoriesValidator,
  labelsValidator
} = require("../validators")
const { setImageUrls } = require('../utils/tattoo-machines')
const { TattooMachine } = require("../models");

const getSingleTattooMachine = async (req, res) => {
  const tattooMachineId = req.params.id
  const lang = req.lang

  const machine = await getTattooMachineById(tattooMachineId, lang)

  if (!machine) {
    throw new BadRequest(`Tattoo machine with id ${tattooMachineId} not found`)
  }

  const machineWithImgUrl = setImageUrls(machine)

  res.status(StatusCodes.OK).json(machineWithImgUrl)
}

const getAllTattooMachines = async (req, res) => {
  const filters = req.query
  const params = {}
  const errors = []

  if(filters.tags) {
    const err = tagsValidator(filters.tags)
    if(err) {
      errors.push(err)
    }

    params.tags = filters.tags
  }

  if(filters.category) {
    const err = categoriesValidator(filters.category)
    if(err) {
      errors.push(err)
    }

    params.category = filters.category
  }

  if(filters.label) {
    const err = labelsValidator(filters.label)
    if(err) {
      errors.push(err)
    }

    params.label = filters.label
  }

  if(filters.page) {
    let page = parseInt(filters.page)
    const err = pageValidator(page)
    if(err) {
      errors.push(err)
    }

    params.page = page
  }

  if(filters.limit) {
    let limit = parseInt(filters.limit)
    const err = limitValidator(limit)
    if(err) {
      errors.push(err)
    }

    params.pageSize = limit
  }

  if(errors.length) {
    throw new BadRequest(errors.join('\n'))
  }

  const machines = await getTattooMachines(params, req.lang)

  if (!machines) {
    throw new BadRequest(`Tattoo machines not found`)
  }

  res.status(StatusCodes.OK).json(machines)
}

const getRelated = async (req, res) => {
  const product = await TattooMachine.findById(req.params.id).lean();
  if (!product) throw new BadRequest(`Tattoo machine with id ${req.params.id} not found`)

  const [combo, recommended, brandItems, similar] = await Promise.all([
    getCombo({
      productId: product._id,
      category: product.category,
      lang: req.lang
    }),
    getRecommendedItems({
      product,
      lang: req.lang
    }),
    getSameBrand({
      productId: product._id,
      brand: product.brand,
      lang: req.lang
    }),
    getSimilar({
      product,
      lang: req.lang
    })
  ])

  res.json({
    combo,
    recommended,
    brands: brandItems,
    similar
  });
};

module.exports = {
  getSingleTattooMachine,
  getAllTattooMachines,
  getRelated
}