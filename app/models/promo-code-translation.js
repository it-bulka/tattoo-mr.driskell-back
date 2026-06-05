const mongoose = require('mongoose')
const { langs } = require('../utils')

const promoCodeTranslationSchema = new mongoose.Schema({
  lang: {
    type: String,
    enum: langs,
    required: [true, `Provide one of: ${langs.join(', ')}`]
  },
  promoCodeId: {
    type: mongoose.Types.ObjectId,
    ref: 'PromoCode',
    required: true
  },
  title: { type: String, required: true },
  description: { type: [String], required: true }
})

promoCodeTranslationSchema.index({ lang: 1, promoCodeId: 1 }, { unique: true })

const PromoCodeTranslation = mongoose.model('PromoCodeTranslation', promoCodeTranslationSchema)

module.exports = { PromoCodeTranslation }
