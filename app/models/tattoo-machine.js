const mongoose = require('mongoose')
const langs = ['uk', 'en']
const tags = ['new', 'hit', 'promotion', 'absent', 'discount']

const tattooMachineTranslationSchema = new mongoose.Schema({
  lang: {
    type: String,
    enum: langs,
    required: [true, `Provide one of following: ${langs.join(' ,')}`]
  },
  price: {
    type: Number,
    required: [true, `Provide price in Ukrainian currency`]
  },
  tags: {
    type: [String],
    enum: tags,
    validate: {
      validator: function (value) {
        return value.length === new Set(value).size
      },
      message: props => `${props.value} contains duplicate values!`
    }
  },
  tattooMachineId: {
    type: mongoose.Types.ObjectId,
    ref: 'TattooMachines',
    required: true
  },
})

tattooMachineTranslationSchema.index({ lang: 1, tattooMachineId: 1 }, { unique: true })

const tattooMachineSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: [true, 'Please provide an image of tattoo machine']
  },
  translations: [{
    type: mongoose.Types.ObjectId,
    ref: 'TattooMachineTranslations',
    required: true
  }]
})

tattooMachineSchema.pre('save', async function (next) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const tattooMachine = this
    const translations = tattooMachine.translations

    const providedLangs = translations.filter(translation => translation.lang)
    const missingLangs = providedLangs.filter(lang => !langs.includes(lang))

    if(missingLangs > 0) {
      throw new Error(`Missing translations for following languages: ${missingLangs.join(', ')}`)
    }

    for (const translation of translations) {
      const newTranslation = new TattooMachineTranslation({
        lang: translation.lang,
        price: translation.price,
        tags: translation.tags
      })

      await newTranslation.save({ session })
    }

    await session.commitTransaction()
    await session.endSession()
    next()
  } catch (e) {
    await session.abortTransaction()
    await session.endSession()
    next(e)
  }
})

const TattooMachineTranslation = mongoose.model('TattooMachineTranslations', tattooMachineTranslationSchema)
const TattooMachine = mongoose.model('TattooMachine', tattooMachineSchema, 'tattoomachines')

module.exports = {
  TattooMachineTranslation,
  TattooMachine
}