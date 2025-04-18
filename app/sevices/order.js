const { PromoCode, TattooMachine, TattooMachineTranslation, Order } = require('../models')
const { applyPromoCode } = require('./promo-codes')
const { NotFound } = require('../errors')
const { fractTwoDigit } = require('../utils')

/**
 * Calculates the total service cost for an order based on the selected services
 * and their respective types (fixed or percentage-based).
 *
 * @param {number} totalOrderCost - The total cost of the order (excluding services).
 * @param {Array<string>} selectedServices - An array of service IDs selected by the user for the order.
 *
 * @returns {Promise<Object>} - An object containing:
 *   - `totalServiceCost` (number): The total cost of all selected services.
 *   - `orderServices` (Array<Object>): An array of objects representing the services applied to the order, each containing:
 *     - `serviceId` (string): The ID of the service.
 *     - `priceAtPurchase` (number): The price of the service at the time of purchase.
 *     - `typeAtPurchase` (string): The type of the service (either "fixed" or "percentage").
 *     - `calculatedServiceCost` (number): The cost of the service as calculated for this order.
 *
 * @throws {NotFound} Throws an error if any of the selected services are not found in the database.
 */
const getOrderService = async (totalOrderCost, selectedServices = []) => {
  let totalPrice = totalOrderCost
  let totalServiceCost = 0
  const orderServices = []

  for (const serviceId of selectedServices) {
    const service = await Service.findById(serviceId)
    if (!service) throw new NotFound("Service not found")

    let serviceCost = service.type === "fixed" ? service.value : (totalPrice * service.value) / 100;
    totalServiceCost += serviceCost

    orderServices.push({
      serviceId: service._id,
      priceAtPurchase: service.value,
      typeAtPurchase: service.type,
      calculatedServiceCost: serviceCost,
    })
  }

  return {
    totalServiceCost,
    orderServices
  }
}

/** @typedef {import('../config/types').ObjectId} ObjectId */
/** @typedef {import('../config/types').ShippingAddress} ShippingAddress */
/** @typedef {import('../config/types').TattooMachine} TattooMachine */
/** @typedef {import('../config/types').PaymentMethod} PaymentMethod */
/** @typedef {import('../config/types').DeloveryMethod} DeloveryMethod */
/** @typedef {import('../config/types').Buyer} Buyer */

const getTattooMachinesForOrder = async (cartItems, lang) => {
  const productIds = cartItems.map(item => item.id)

  const machines = await TattooMachine.find({ _id: { $in: productIds } })
  const translations = await TattooMachineTranslation.find({
    tattooMachineId: { $in: productIds },
    lang: lang
  })

  const translationMap = {}
  translations.forEach(t => {
    translationMap[t.tattooMachineId.toString()] = t.title
  })

  const orderItems = cartItems.map(item => {
    const machine = machines.find(m => m._id.toString() === item.id)
    const nameAtPurchase = translationMap[item.id] || 'No translation'
    const priceAtPurchase = machine.priceCurrent ?? machine.price

    return {
      tattooMachineId: machine._id,
      quantity: item.quantity,
      nameAtPurchase,
      priceAtPurchase,
      originalPriceAtPurchase: machine.price,
      imageAtPurchase: machine.images[0]
    }
  })

  return orderItems
}

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

  const tattooMachines = await getTattooMachinesForOrder(items, lang)
  const checkedItems = tattooMachines.reduce((sum, { priceAtPurchase, originalPriceAtPurchase, quantity }) => {
    const itemOriginalTotalPrice = originalPriceAtPurchase * quantity
    const itemDiscount = (originalPriceAtPurchase - priceAtPurchase) * quantity

    return {
      totalPrice: sum.totalPrice + itemOriginalTotalPrice,
      totalDiscount: sum.totalDiscount + itemDiscount,
    }
  }, { totalPrice: 0, totalDiscount: 0 })

  totalPrice = fractTwoDigit(checkedItems.totalPrice)
  discount = fractTwoDigit(checkedItems.totalDiscount)

  if (promoCode) {
    const promo = await applyPromoCode(promoCode, totalPrice)
    discount = promo.discount
    promoCodeId = promo.promoCodeId
  }

  const {
    totalServiceCost,
    orderServices
  } = await getOrderService(totalPrice, selectedServices)

  const finalPrice = totalPrice + totalServiceCost - discount

  const order = new Order({
    userId,
    items: tattooMachines,
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
