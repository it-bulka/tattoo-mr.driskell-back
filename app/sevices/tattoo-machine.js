const {
  TattooMachine, TattooMachineTranslation
} =  require("../models")
const mongoose = require('mongoose')
const { getTattooMachineAggregationPipeline } = require('../utils/getTattooMachineAggregationPipeline')
const {
  getTattooMachinesWithPagination,
  setMultipleImageUrls,
  getTotalCount
} = require('../utils/tattoo-machines')

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
  console.log('machines', machines)
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

const getSetForSingleTattooMachine = async (req, res) => {
  const compatibleSets = {
    'tattoo-machines': ['tattoo-needles', 'tattoo-inks', 'power-supplies'],
    'tattoo-sets': ['tattoo-inks', 'tattoo-needles', 'accessories'],
    'tattoo-inks': ['tattoo-machines', 'tattoo-needles', 'accessories'],
    // ...
  }
}

module.exports = {
  getTattooMachineById,
  getTattooMachines,
  deleteTranslationsByTattooMachine
}