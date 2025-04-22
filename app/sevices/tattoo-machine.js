const {
  TattooMachine, TattooMachineTranslation
} =  require("../models")
const mongoose = require('mongoose')
const {
  getTattooMachineAggregationPipeline,
  getPureFieldsPipeline
} = require('../utils/getTattooMachineAggregationPipeline')
const {
  getTattooMachinesWithPagination,
  setMultipleImageUrls,
  getTotalCount
} = require('../utils/tattoo-machines')

const { compatibleSets, specsPropertyList } = require('../consts/tattoo-machines')

/** @typedef {import('../types').ObjectId} ObjectId */
/** @typedef {import('../types').Language} Language */
/** @typedef {import('../types').TattooMachine} TattooMachine */

/**
 * @param {ObjectId} id - The ID of the tattoo machine.
 * @param {Language} lang - The language for the tattoo machine's translation.
 * @returns {Promise<TattooMachine>} A promise that resolves with the tattoo machine data and translation.
 */
const getTattooMachineById = async (id, lang) => {

  const machines  = await TattooMachine.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...getTattooMachineAggregationPipeline(lang),
    { $limit: 1 }
  ])

  return machines[0] || null
}

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - The page number (default is 1).
 * @property {number} pageSize - The number of items per page (default is 10).
 *
 * @typedef {Object} PaginatedTattooMachines
 * @property {Array<TattooMachine>} machines - List of tattoo machines on the current page.
 * @property {number} totalCount - The total number of tattoo machines.
 * @property {number} totalPages - The total number of pages.
 * @property {number} currentPage - The current page number.
 *
 * @param {PaginationParams} params - The pagination parameters object.
 * @param {string} lang - The language for the tattoo machine translation.
 * @returns {Promise<PaginatedTattooMachines>} - A promise that resolves to an object containing pagination data for tattoo machines.
 */
const getTattooMachines = async (params, lang) => {
  const { page = 1, pageSize = 10, ...rest } = params

  const { machines, totalCount } = await getTattooMachinesWithPagination({ page, pageSize, lang, ...rest });
  const machinesWithImgUrl = setMultipleImageUrls(machines);

  return {
    machines: machinesWithImgUrl,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page
  }
}

const deleteTranslationsByTattooMachine = async (tattooMachineId) => {
  await TattooMachineTranslation.deleteMany({ tattooMachineId })
}

const getCombo = async ({ productId, category, lang}) => {
  const otherCategories = compatibleSets[category] || []

  const combo = await Promise.all(
    otherCategories.map(itemCategory =>
      TattooMachine.aggregate([
        { $match: { category: itemCategory, _id: { $ne: productId } } },
        { $sample: { size: 1 } },
        ...getPureFieldsPipeline(lang)
      ])
    )
  )

  return setMultipleImageUrls(combo.flat())
}

const getSameBrand = async ({ brand, productId, lang }) => {
  const brandItems = await TattooMachine.aggregate([
    { $match: { brand, _id: { $ne: productId } } },
    { $sample: { size: 15 } },
    ...getPureFieldsPipeline(lang)
  ])

  return setMultipleImageUrls(brandItems)
}

const getSimilar = async ({ product, lang }) => {
  const productDetails = await TattooMachineTranslation.findOne({
    tattooMachineId: product._id,
    lang: lang
  }).lean()

  const specsKeys = specsPropertyList[product.category]
  const orFilters = specsKeys.map(key => ({ [`translation.specs.${key}`]: productDetails.specs[key] }))

  const similarityConditions = specsKeys.map(key => ({
    $cond: [{ $eq: [`$translation.specs.${key}`, productDetails.specs[key]] }, 1, 0]
  }))

  const similar = await TattooMachine.aggregate([
    {
      $match: {
        _id: { $ne: product._id },
        category: product.category,
      }
    },
    {
      $lookup: {
        from: "tattoomachinetranslations",
        let: { productId: "$_id", lang: lang },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$tattooMachineId", "$$productId"] },
                  { $eq: ["$lang", "$$lang"] }
                ]
              }
            }
          }
        ],
        as: "translation"
      }
    },
    {
      $unwind: {
        path: '$translation',
        preserveNullAndEmptyArrays: false,
      }
    },
    {
      $match: { $or: orFilters }
    },
    {
      $addFields: {
        similarity: {
          $add: similarityConditions
        }
      }
    },
    {
      $sort: { similarity: -1 }
    },
    {
      $limit: 15
    },
    ...getPureFieldsPipeline(lang)
  ])

  return setMultipleImageUrls(similar)
}

const getRecommendedItems = async ({ product, lang }) => {
  const machines  = await TattooMachine.aggregate([
    {
      $match: {
        _id: { $ne: product._id },
        category: product.category,
        labels: { $in: ['popular'] },
      },
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    { $limit: 15 },
    ...getPureFieldsPipeline(lang)
  ])

  return setMultipleImageUrls(machines) || []
}

const fetchTattooMachinesByCartItems = async (cartItems) => {
  const productIds = cartItems.map(item => item.id)
  const machines = await TattooMachine.find({ _id: { $in: productIds } })
  return machines
}

module.exports = {
  getTattooMachineById,
  getTattooMachines,
  deleteTranslationsByTattooMachine,
  getCombo,
  getSameBrand,
  getSimilar,
  getRecommendedItems,
  fetchTattooMachinesByCartItems
}