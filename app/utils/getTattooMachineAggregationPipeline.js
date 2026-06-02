const getSortStage = (sort) => {
  switch (sort) {
    case 'cheap':         return { $sort: { price: 1 } }
    case 'expensive':     return { $sort: { price: -1 } }
    case 'alphabetically': return null // applied after translation join
    default:              return { $sort: { createdAt: -1 } }
  }
}

const getAlphabeticallySortPipeline = (sort) =>
  sort === 'alphabetically' ? [{ $sort: { title: 1 } }] : []

const getSpecsPipeline = (field, values) => {
  const arr = Array.isArray(values) ? values : values.split(',')
  return [{ $match: { [`specs.${field}`]: { $in: arr } } }]
}

const getInStockPipeline = () => [{ $match: { stock: { $gt: 0 } } }]

const getBrandPipeline = (brandId) => [{ $match: { brand: brandId } }]

const getPricePipeline = (minPrice, maxPrice) => {
  const cond = {}
  if (minPrice !== undefined) cond.$gte = Number(minPrice)
  if (maxPrice !== undefined) cond.$lte = Number(maxPrice)
  return [{ $match: { price: cond } }]
}

const getTagsPipeline = (tagsQuery) => {
  const tagsArray = Array.isArray(tagsQuery) ? tagsQuery : tagsQuery.split(',')
  return [{ $match: { tags: { $in: tagsArray } } }]
}

const getCategoriesPipeline = (categoriesQuery) => {
  const categoriesArray = Array.isArray(categoriesQuery) ? categoriesQuery : categoriesQuery.split(',')
  return [{ $match: { category: { $in: categoriesArray } } }]
}

const getLabelsPipeline = (labelsQuery) => {
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
  getSpecsPipeline,
  getInStockPipeline,
  getBrandPipeline,
  getPricePipeline,
  getSortStage,
  getAlphabeticallySortPipeline,
  excludeDetails,
  getPureFieldsPipeline
}
