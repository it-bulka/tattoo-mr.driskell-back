const { TattooMachine } = require('../models')
const {
  getTattooMachineAggregationPipeline, getTagsPipeline,getCategoriesPipeline,
  getLabelsPipeline,
  excludeDetails
} = require('./getTattooMachineAggregationPipeline')
const { setUrl } = require('./setUrl')

const getTattooMachinesWithPagination = async ({
  page, pageSize, lang, tags, category, label, detailed
}) => {
  const result = await TattooMachine.aggregate([
    { $sort: { createdAt: -1 } },
    ...getTattooMachineAggregationPipeline(lang),
    ...(tags ? getTagsPipeline(tags) : []),
    ...(category ? getCategoriesPipeline(category) : []),
    ...(label ? getLabelsPipeline(label) : []),
    ...(!detailed ? excludeDetails() : []),
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

const setImageUrls = (machine) => {
  return {
    ...machine,
    images: machine.images.map(img => setUrl(img))
  }
}
const setMultipleImageUrls = (machines) => {
  return machines.map(setImageUrls)
}

const getTotalCount = async () => {
  return TattooMachine.countDocuments()
}

module.exports = {
  setImageUrls,
  setMultipleImageUrls,
  getTotalCount,
  getTattooMachinesWithPagination,
}

