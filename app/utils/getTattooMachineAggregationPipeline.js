const getTattooMachineAggregationPipeline = (lang) => [
  {
    $lookup: {
      from: "tattoomachinetranslations",
      localField: "_id",
      foreignField: "tattooMachineId",
      as: "translation",
    }
  },
  {
    $unwind: {
      path: '$translation',
      preserveNullAndEmptyArrays: false,
    }
  },
  {
    $match: {
      'translation.lang': lang
    }
  },
  {
    $project: {
      id: '$_id',
      _id: 0,
      images: 1,
      price: '$translation.price',
      tags: '$translation.tags',
      lang: '$translation.lang',
    }
  }
]

module.exports = {
  getTattooMachineAggregationPipeline
}
