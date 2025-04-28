const { TattooMachineTranslation } = require('../models/tattoo-machine')
const { escapeRegex } = require('../utils')
const { setMultipleImageUrls } = require('../utils/tattoo-machines')

const searchTattooMachines = async (searchBy) => {
  const search = escapeRegex(searchBy.trim()).split(/\s+/).join('.*')

  const result = await TattooMachineTranslation.aggregate([
    { $match: { title: { $regex: search, $options: 'i' } } },
    {
      $lookup: {
        from: 'tattoomachines',
        localField: 'tattooMachineId',
        foreignField: '_id',
        as: 'machineData'
      }
    },
    { $unwind: '$machineData' },
    {
      $addFields: {
        id: '$machineData._id',
        images: '$machineData.images',
        tags: '$machineData.tags',
        category: '$machineData.category',
        labels: '$machineData.labels',
        price: '$machineData.price',
        priceCurrent: '$machineData.priceCurrent',
        currency: '$machineData.currency',
        stock: '$machineData.stock',
      }
    },
    {
      $project: {
        machineData: 0,
        specs: 0,
        shortDescription: 0,
        longDescription: 0,
        tattooMachineId: 0,
        __v: 0,
        _id: 0,
      }
    }
  ])

  return setMultipleImageUrls(result)
}

module.exports = {
  searchTattooMachines
}