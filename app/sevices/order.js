const { PromoCode, Order } = require('../models')
const { applyPromoCode, getPromoCode } = require('./promo-codes')
const { fractTwoDigit } = require('../utils')
const { calculateProductPrice, getOrderServiceCost } = require('./price')

/**
 *
 * @param {string} userId
 * @param {string[]} items - The list of ids of tattoo machines to buy
 * @param {ShippingAddress} shippingAddress - The address for shipping order
 * @param {PaymentMethod} paymentMethod
 * @param {DeloveryMethod} deloveryMethod
 * @param {string} promoCode
 * @param {Buyer} buyer
 * @param {[string]} selectedServices - the list of chosen services ids
 * @return {Promise<*>}
 */
const createOrder = async ({
  userId,
  items,
  shippingAddress,
  paymentMethod,
  promoCode,
  deliveryMethod,
  selectedServices,
  buyer
}, lang) => {
  let totalPrice = 0
  let discount = 0
  let promoCodeId = null

  const prodPrice = await calculateProductPrice(items, lang, 'order')
  totalPrice += prodPrice.totalPrice
  discount += prodPrice.discount


  const {
    totalServiceCost,
    orderServices
  } = await getOrderServiceCost(totalPrice, selectedServices)
  totalPrice += totalServiceCost

  if (promoCode) {
    const promo = await getPromoCode(promoCode)
    const promoCalculation = await applyPromoCode(promo, totalPrice)
    discount += promoCalculation.discount
    promoCodeId = promoCalculation.promoCodeId
  }

  const finalPrice = totalPrice - discount

  const order = new Order({
    userId,
    items: prodPrice.tattooMachines,
    totalOriginalProductsPrice: fractTwoDigit(totalPrice),
    totalPrice: fractTwoDigit(finalPrice),
    totalServiceCost,
    totalDiscounts: fractTwoDigit(discount),
    promoCode: promoCodeId,
    services: orderServices,
    shippingAddress,
    deliveryMethod,
    paymentMethod,
    buyer
  })

  await order.save()

  if (promoCodeId) {
    await PromoCode.findByIdAndUpdate(promoCodeId, { $inc: { usedCount: 1 } })
  }

  return order
}

module.exports = {
  createOrder
}
