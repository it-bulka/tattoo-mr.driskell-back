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
const { getActiveDiscounts, applyDiscountsToProducts } = require('./discount')

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
  const [machines, activeDiscounts] = await Promise.all([
    TattooMachine.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      ...getTattooMachineAggregationPipeline(lang),
      { $limit: 1 }
    ]),
    getActiveDiscounts()
  ])

  const machine = machines[0] || null
  if (!machine) return null

  return applyDiscountsToProducts([machine], activeDiscounts)[0]
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

  const [{ machines, totalCount }, activeDiscounts] = await Promise.all([
    getTattooMachinesWithPagination({ page, pageSize, lang, ...rest }),
    getActiveDiscounts()
  ])

  const machinesWithImgUrl = setMultipleImageUrls(machines)
  const machinesWithDiscounts = applyDiscountsToProducts(machinesWithImgUrl, activeDiscounts)

  return {
    machines: machinesWithDiscounts,
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

  const [comboRaw, activeDiscounts] = await Promise.all([
    Promise.all(
      otherCategories.map(itemCategory =>
        TattooMachine.aggregate([
          { $match: { category: itemCategory, _id: { $ne: productId } } },
          { $sample: { size: 1 } },
          ...getPureFieldsPipeline(lang)
        ])
      )
    ),
    getActiveDiscounts()
  ])

  const combo = setMultipleImageUrls(comboRaw.flat())
  return applyDiscountsToProducts(combo, activeDiscounts)
}

const getSameBrand = async ({ brand, productId, lang }) => {
  const [brandItems, activeDiscounts] = await Promise.all([
    TattooMachine.aggregate([
      { $match: { brand, _id: { $ne: productId } } },
      { $sample: { size: 15 } },
      ...getPureFieldsPipeline(lang)
    ]),
    getActiveDiscounts()
  ])

  return applyDiscountsToProducts(setMultipleImageUrls(brandItems), activeDiscounts)
}

const getSimilar = async ({ product, lang }) => {
  const [similar, activeDiscounts] = await Promise.all([
    TattooMachine.aggregate([
      { $match: { category: product.category, _id: { $ne: product._id } } },
      { $sample: { size: 15 } },
      ...getPureFieldsPipeline(lang)
    ]),
    getActiveDiscounts()
  ])

  return applyDiscountsToProducts(setMultipleImageUrls(similar), activeDiscounts)
}

const getRecommendedItems = async ({ product, lang }) => {
  const [machines, activeDiscounts] = await Promise.all([
    TattooMachine.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          category: product.category,
          labels: { $in: ['popular'] },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 15 },
      ...getPureFieldsPipeline(lang)
    ]),
    getActiveDiscounts()
  ])

  return applyDiscountsToProducts(setMultipleImageUrls(machines) || [], activeDiscounts)
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