const getTagsPipeline = (tagsQuery) => {
  const tagsArray = Array.isArray(tagsQuery) ? tagsQuery : tagsQuery.split(',')
  return [{ $match: { tags: { $in: tagsArray } } }]
}

const getCategoriesPipeline = (categoriesQuery) => {
  const categoriesArray = Array.isArray(categoriesQuery) ? categoriesQuery : categoriesQuery.split(',')
  return [{ $match: { categories: { $in: categoriesArray } } }]
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
      categories: '$categories',
    }
  }
]

module.exports = {
  getTattooMachineAggregationPipeline,
  getTagsPipeline,getCategoriesPipeline
}
