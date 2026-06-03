const { StatusCodes } = require('http-status-codes')
const { Brand } = require('../models/brands')

const getAllBrands = async (req, res) => {
  const lang = req.lang

  const brands = await Brand.aggregate([
    {
      $lookup: {
        from: 'brandtranslations',
        let: { brandId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$brandId', '$$brandId'] } } }
        ],
        as: 'translations'
      }
    },
    {
      $addFields: {
        reqT: {
          $arrayElemAt: [
            { $filter: { input: '$translations', cond: { $eq: ['$$this.lang', lang] } } },
            0
          ]
        },
        defT: {
          $arrayElemAt: [
            { $filter: { input: '$translations', cond: { $eq: ['$$this.lang', '$defaultLang'] } } },
            0
          ]
        }
      }
    },
    {
      $project: {
        id: '$_id',
        _id: 0,
        slug: 1,
        imgUrl: 1,
        defaultLang: 1,
        requiredLang: { $ifNull: ['$reqT.lang', '$defT.lang'] },
        name: { $ifNull: ['$reqT.name', '$defT.name'] }
      }
    },
    { $sort: { name: 1 } }
  ])

  res.status(StatusCodes.OK).json(brands)
}

module.exports = { getAllBrands }
