const mongoose = require('mongoose')
const { langs } = require('../utils')
const { BrandTranslation } = require('./brand-translation')

const brandSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  imgUrl: {
    type: String,
    default: ''
  },
  defaultLang: {
    type: String,
    enum: langs,
    default: 'en'
  }
})

brandSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await BrandTranslation.deleteMany({ brandId: this._id })
    next()
  } catch (err) {
    next(err)
  }
})

brandSchema.pre('deleteMany', async function (next) {
  try {
    const docs = await this.model.find(this.getQuery())
    await Promise.all(docs.map(doc => BrandTranslation.deleteMany({ brandId: doc._id })))
    next()
  } catch (err) {
    next(err)
  }
})

const Brand = mongoose.model('Brand', brandSchema)

module.exports = { Brand }
