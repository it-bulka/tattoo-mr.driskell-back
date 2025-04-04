const { TattooMachine } = require('../models')
const {
  getTattooMachineAggregationPipeline, getTagsPipeline,getCategoriesPipeline
} = require('./getTattooMachineAggregationPipeline')
const { setUrl } = require('./setUrl')

const getTattooMachinesWithPagination = async ({ page, pageSize, lang, tags, category }) => {
  const result = await TattooMachine.aggregate([
    { $sort: { createdAt: -1 } },
    ...getTattooMachineAggregationPipeline(lang),
    ...(tags ? getTagsPipeline(tags) : []),
    ...(category ? getCategoriesPipeline(category) : []),
    { $facet: {
        data: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize }
        ],
        totalCount: [
          { $count: "count" }
        ]
      }}
  ])

  const machines = result[0].data
  const totalCount = result[0].totalCount[0]?.count || 0

  return {
    machines,
    totalCount
  }
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

