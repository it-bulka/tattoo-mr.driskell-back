const { PromoCode } = require('../models/promo-codes')
const { BadRequest, NotFound, Forbidden } = require('../errors')
const { calculateProductPrice, getOrderServiceCost } = require('./price')
const { fractTwoDigit } = require('../utils')
const { validateCartItems } = require("./cart-validation")
const { updateUserCart } = require('./cart')

const getPromoCode = async (promoCode) => {
  const code = await PromoCode.findOne({ code: promoCode, isActive: true })
  return code
}

const applyPromoCode = async (promoData, orderTotal) => {
  if (promoData.expiresAt < new Date()) {
    throw new Forbidden('The promo code is expired')
  }

  if (promoData.usageLimit > 0 && promoData.usedCount >= promoData.usageLimit) {
    throw new Forbidden('The promo code can not be used any more')
  }

  if (orderTotal < promoData.minOrderValue) {
    throw new BadRequest(`The minimum order amount for this promo code is: ${promoData.minOrderValue}`)
  }

  let discount = 0
  if (promoData.discountType === 'percentage') {
    discount = (orderTotal * promoData.discountValue) / 100;
  } else if (promoData.discountType === 'fixed') {
    discount = promoData.discountValue
  }

  return { discount, promoCodeId: promoData._id }
}

const promoActivate = async ({
  promoCode,
  items,
  selectedServices,
  lang
}) => {
  if(!promoCode) {
    throw new NotFound('The promo code is not provided.')
  }

  const promo = await getPromoCode(promoCode)
  if (!promo) {
    throw new NotFound(`The promo code ${promoCode} is invalid or does not exist.`)
  }
  const result = await validateCartItems(items)
  if(!result.valid) {
    throw new BadRequest(result.error)
  }

  let totalPrice = 0
  let discount = 0

  const prodPrice = await calculateProductPrice(items, lang, 'cart')
  totalPrice += prodPrice.totalPrice
  discount += prodPrice.discount

  const {
    totalServiceCost,
    orderServices
  } = await getOrderServiceCost(totalPrice, selectedServices)
  totalPrice += totalServiceCost

  const promoCalculation = await applyPromoCode(promo, totalPrice)
  discount += promoCalculation.discount

  const finalPrice = totalPrice - discount

  return {
    promocode: {
      id: promo._id,
      code: promo.code,
      type: promo.discountType,
      value: promo.discountValue
    },
    items: prodPrice.tattooMachines,
    totalItems: prodPrice.tattooMachines.length,
    discount: fractTwoDigit(discount),
    extraServices: fractTwoDigit(totalServiceCost),
    extraServicesItems: orderServices,
    totalToPay: fractTwoDigit(finalPrice)
  }
}

module.exports = {
  getPromoCode,
  applyPromoCode,
  promoActivate
}