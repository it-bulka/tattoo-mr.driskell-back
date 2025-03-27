const mongoose = require('mongoose')
const { langs } = require('../utils')
const tags = ['new', 'hit', 'promotion', 'absent', 'discount']
const { BadRequest } = require('../errors')

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
})

tattooMachineSchema.pre('save', function (next) {
  try {
    const translations = this.$locals.translations

    if(!translations) throw new BadRequest(`Provide translations for tattoo machine`)

    const providedLangs = translations.filter(translation => translation.lang)
    const missingLangs = providedLangs.filter(lang => !langs.includes(lang))

    if(missingLangs > 0) {
      throw new BadRequest(`Missing translations for following languages: ${missingLangs.join(', ')}`)
    }

    next()
  } catch (error) {
    next(error)
  }
})

tattooMachineSchema.post('save', async function () {
  if (!this.$locals.translations) {
    throw new BadRequest(`Provide translations for tattoo machine`)
    await this.deleteOne()
  }

  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      for (let translation of this.$locals.translations) {
        const newTranslation = new TattooMachineTranslation({
          lang: translation.lang,
          price: translation.price,
          tattooMachineId: translation.tattooMachineId,
        })

        await newTranslation.save({ session })
      }
    })
  } catch (e) {
    console.error(`Translations saving: ${e}`)
  }
})

tattooMachineSchema.pre('deleteOne', async function (next) {
  try {
    await TattooMachineTranslation.deleteMany({ tattooMachineId: this._id })

    next()
  } catch (err) {
    next(err)
  }
})

tattooMachineSchema.pre('deleteMany', async function (next) {
  try {
    const documentsToDelete = await this.model.find(this.getQuery())

    const deletingFuncs = documentsToDelete.map(async (doc) => {
      await TattooMachineTranslation.deleteMany({ tattooMachineId: doc._id })
    })

    await Promise.all(deletingFuncs)
    next()
  } catch (err) {
    next(err)
  }
})

const TattooMachineTranslation = mongoose.model('TattooMachineTranslations', tattooMachineTranslationSchema)
const TattooMachine = mongoose.model('TattooMachine', tattooMachineSchema, 'tattoomachines')

module.exports = {
  TattooMachineTranslation,
  TattooMachine
}