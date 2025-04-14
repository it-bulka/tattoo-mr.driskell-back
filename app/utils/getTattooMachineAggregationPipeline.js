const getTagsPipeline = (tagsQuery) => {
  const tagsArray = Array.isArray(tagsQuery) ? tagsQuery : tagsQuery.split(',')
  return [{ $match: { tags: { $in: tagsArray } } }]
}

const getCategoriesPipeline = (categoriesQuery) => {
  const categoriesArray = Array.isArray(categoriesQuery) ? categoriesQuery : categoriesQuery.split(',')
  return [{ $match: { category: { $in: categoriesArray } } }]
}

const getLabelsPipeline = (labelsQuery) => {
  console.log('labelsQuery', labelsQuery)
  const labelsArray = Array.isArray(labelsQuery) ? labelsQuery : labelsQuery.split(',')
  return [{ $match: { labels: { $in: labelsArray } } }]
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
      price: 1,
      priceCurrent: 1,
      lang: '$translation.lang',
      title: '$translation.title',
      specs: '$translation.specs',
      longDescription: '$translation.longDescription',
      shortDescription: '$translation.shortDescription',
      stock: 1,
      tags: '$tags',
      category: 1,
      labels: 1,
    }
  }
]

const excludeDetails = () => ([
  { $project: {
      specs: 0,
      labels: 0,
      categories: 0,
      longDescription: 0,
      shortDescription: 0,
    }
  }
])

const getPureFieldsPipeline = (lang) => {
  return [
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
        title: '$translation.title',
        price: 1,
        priceCurrent: 1,
        currency: 1,
        tags: 1
      }
    }
  ]
}

module.exports = {
  getTattooMachineAggregationPipeline,
  getTagsPipeline,
  getCategoriesPipeline,
  getLabelsPipeline,
  excludeDetails,
  getPureFieldsPipeline
}
