const mongoose = require('mongoose')
const { Schema } = mongoose

const CATEGORIES = [
  'tattoo-sets', 'tattoo-machines', 'tattoo-inks', 'tattoo-needles',
  'tattoo-holders', 'tattoo-tips', 'power-supplies', 'pedals-and-wires',
  'accessories', 'printers-and-tablets', 'protection-containers-consumables'
]

const tierSchema = new Schema({
  minItems: { type: Number, required: true, min: 1 },
  value: { type: Number, required: true, min: 0 },
  isPercentage: { type: Boolean, default: true }
}, { _id: false })

const discountSchema = new Schema({
  type: {
    type: String,
    enum: ['product', 'category', 'cart', 'bundle'],
    required: true
  },
  value: { type: Number, required: true, min: 0 },
  isPercentage: { type: Boolean, default: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  stackable: { type: Boolean, default: false },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'TattooMachine' }],
  categories: [{ type: String, enum: CATEGORIES }],
  bundleProductIds: [{ type: Schema.Types.ObjectId, ref: 'TattooMachine' }],
  tiers: [tierSchema]
}, { timestamps: true })

const Discount = mongoose.model('Discount', discountSchema)

module.exports = { Discount }
