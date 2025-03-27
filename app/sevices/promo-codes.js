const { PromoCode } = require('../models/promo-codes')
const { BadRequest, NotFound, Forbidden } = require('../errors')

const applyPromoCode = async (promoCode, orderTotal) => {
  const code = await PromoCode.findOne({ code: promoCode, isActive: true })

  if (!code) {
    throw new NotFound('The promo code is invalid or does not exist.')
  }

  if (code.expiresAt < new Date()) {
    throw new Forbidden('The promo code is expired')
  }

  if (code.usageLimit > 0 && code.usedCount >= code.usageLimit) {
    throw new Forbidden('The promo code can not be used any more')
  }

  if (orderTotal < code.minOrderValue) {
    throw new BadRequest(`The minimum order amount for this promo code is: ${code.minOrderValue}`)
  }

  let discount = 0
  if (code.discountType === 'percentage') {
    discount = (orderTotal * code.discountValue) / 100;
  } else if (code.discountType === 'fixed') {
    discount = code.discountValue
  }

  return { discount, promoCodeId: code._id }
}

module.exports = {
  applyPromoCode
}