const {
  getTattooMachineById,
  getTattooMachines,
  getCombo,
  getSameBrand,
  getSimilar,
  getRecommendedItems,
  fetchProductsByIds
} = require("../sevices/tattoo-machine")
const { getBundleForProduct } = require('../sevices/bundle')

const { BadRequest } = require("../errors")
const { StatusCodes } = require('http-status-codes')
const {
  tagsValidator,
  pageValidator,
  limitValidator,
  categoriesValidator,
  labelsValidator,
  motorTypeValidator,
  needleTypeValidator,
} = require("../validators")
const { setImageUrls } = require('../utils/tattoo-machines')
const { TattooMachine } = require("../models")
const { Brand } = require('../models/brands')
const { searchTattooMachines } = require('../sevices/search')

const ALLOWED_SEARCH_LANGS = ['en', 'uk']

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

  if(filters.sort) {
    const allowed = ['popular', 'cheap', 'expensive', 'alphabetically']
    if (!allowed.includes(filters.sort)) {
      errors.push(`Invalid 'sort' parameter. Allowed values: ${allowed.join(', ')}`)
    } else {
      params.sort = filters.sort
    }
  }

  if(filters.inStock === 'true') {
    params.inStock = true
  }

  if(filters.motorType) {
    const err = motorTypeValidator(filters.motorType)
    if(err) {
      errors.push(err)
    } else {
      params.motorType = filters.motorType
    }
  }

  if(filters.needleType) {
    const err = needleTypeValidator(filters.needleType)
    if(err) {
      errors.push(err)
    } else {
      params.needleType = filters.needleType
    }
  }

  if(filters.minPrice !== undefined) {
    const val = Number(filters.minPrice)
    if (isNaN(val) || val < 0) {
      errors.push(`Invalid 'minPrice' parameter. Must be a non-negative number.`)
    } else {
      params.minPrice = val
    }
  }

  if(filters.maxPrice !== undefined) {
    const val = Number(filters.maxPrice)
    if (isNaN(val) || val < 0) {
      errors.push(`Invalid 'maxPrice' parameter. Must be a non-negative number.`)
    } else {
      params.maxPrice = val
    }
  }

  if (filters.brandSlug) {
    const brand = await Brand.findOne({ slug: filters.brandSlug })
    if (!brand) {
      throw new BadRequest(`Brand '${filters.brandSlug}' not found`)
    }
    params.brandId = brand._id
  }

  if (filters.onlyDiscounted === 'true') {
    params.onlyDiscounted = true
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

  const [bundle, recommended, brandItems, similar] = await Promise.all([
    getBundleForProduct(product._id),
    getRecommendedItems({ product, lang: req.lang }),
    getSameBrand({ productId: product._id, brand: product.brand, lang: req.lang }),
    getSimilar({ product, lang: req.lang })
  ])

  let combo, bundleDiscountTiers
  if (bundle) {
    combo = await fetchProductsByIds(bundle.comboProductIds, req.lang)
    bundleDiscountTiers = bundle.tiers
  } else {
    combo = await getCombo({ productId: product._id, category: product.category, lang: req.lang })
    bundleDiscountTiers = null
  }

  res.json({
    combo,
    bundleDiscountTiers: bundleDiscountTiers || null,
    recommended,
    brands: brandItems,
    similar
  });
};

const getSearchedTattooMachines = async (req, res) => {
  const { search, lang } = req.query

  if (!search || search.length < 2) {
    return res.status(400).json({ message: 'Enter at least 2 characters' })
  }

  const resolvedLang = ALLOWED_SEARCH_LANGS.includes(lang) ? lang : 'uk'
  const foundMachines = await searchTattooMachines(search, resolvedLang)

  return res.status(StatusCodes.OK).json({ data: foundMachines, success: true })
}

module.exports = {
  getSingleTattooMachine,
  getAllTattooMachines,
  getRelated,
  getSearchedTattooMachines
}