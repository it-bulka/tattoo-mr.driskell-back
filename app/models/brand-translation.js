const mongoose = require('mongoose')
const { langs } = require('../utils')

const brandTranslationSchema = new mongoose.Schema({
  lang: {
    type: String,
    enum: langs,
    required: [true, `Provide one of following: ${langs.join(', ')}`]
  },
  brandId: {
    type: mongoose.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Provide brand name translation']
  }
})

brandTranslationSchema.index({ lang: 1, brandId: 1 }, { unique: true })

const BrandTranslation = mongoose.model('BrandTranslation', brandTranslationSchema)

module.exports = { BrandTranslation }
