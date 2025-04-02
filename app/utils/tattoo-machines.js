const { TattooMachine } = require('../models')
const { getTattooMachineAggregationPipeline } = require('./getTattooMachineAggregationPipeline')
const { setUrl } = require('./setUrl')

const getTattooMachinesWithPagination = async (page, pageSize, lang) => {
  return TattooMachine.aggregate([
    { $sort: { createdAt: -1 } },
    ...getTattooMachineAggregationPipeline(lang),
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize }
  ])
}

const setImageUrls = (machines) => {
  return machines.map(machine => ({
    ...machine,
    images: machine.images.map(img => setUrl(img))
  }))
}

const getTotalCount = async () => {
  return TattooMachine.countDocuments()
}

module.exports = {
  setImageUrls,
  getTotalCount,
  getTattooMachinesWithPagination,
}

