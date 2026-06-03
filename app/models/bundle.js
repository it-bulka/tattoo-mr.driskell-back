const mongoose = require('mongoose')
const { Schema } = mongoose

const tierSchema = new Schema({
  minItems: { type: Number, required: true, min: 1 },
  value: { type: Number, required: true, min: 0 },
  isPercentage: { type: Boolean, default: true }
}, { _id: false })

const bundleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  tiers: [tierSchema],
  productIds: [{ type: Schema.Types.ObjectId, ref: 'TattooMachine' }]
}, { timestamps: true })

const Bundle = mongoose.model('Bundle', bundleSchema)

module.exports = { Bundle }
