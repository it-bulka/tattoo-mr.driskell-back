const getTagsPipeline = (tagsQuery) => {
  const tagsArray = Array.isArray(tagsQuery) ? tagsQuery : tagsQuery.split(',')
  console.log('tagsArray', tagsArray)
  return [{ $match: { tags: { $in: tagsArray } } }]
}

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
      lang: '$translation.lang',
      tags: '$tags',
    }
  }
]

module.exports = {
  getTattooMachineAggregationPipeline,
  getTagsPipeline
}
