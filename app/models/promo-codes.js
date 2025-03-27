const mongoose = require('mongoose')

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  minOrderValue: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
})

const PromoCode = mongoose.model('PromoCode', PromoCodeSchema)
module.exports = {
  PromoCode
}