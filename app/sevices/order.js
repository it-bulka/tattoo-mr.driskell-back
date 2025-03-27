const { PromoCode, TattooMachine, Order } = require('../models')
const { applyPromoCode } = require('./promo-codes')
const { NotFound } = require('../errors')

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
const getOrderService = async (totalOrderCost, selectedServices) => {
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

/** @typedef {import('../types').ObjectId} ObjectId */
/** @typedef {import('../types').ShippingAddress} ShippingAddress */
/** @typedef {import('../types').TattooMachine} TattooMachine */
/** @typedef {import('../types').PaymentMethod} PaymentMethod */
/** @typedef {import('../types').DeloveryMethod} DeloveryMethod */
/** @typedef {import('../types').Buyer} Buyer */

const getTattooMachinesForOrder = async (itemsIds) => {
  const tattooMachinePromises = itemsIds.map(async (item) => {
    const machine = await TattooMachine.findById(item._id);
    if (!machine) throw new NotFound(`Tattoo machine with id ${item._id} not found`);
    return { price: machine.price, quantity: item.quantity };
  });

  const tattooMachines = await Promise.all(tattooMachinePromises)
  return tattooMachines
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
}) => {
  let totalPrice = 0
  let discount = 0
  let promoCodeId = null

  const tattooMachines = await getTattooMachinesForOrder(items)
  totalPrice = tattooMachines.reduce((sum, { price, quantity }) => sum + price * quantity, 0)

  if (promoCode) {
    const promo = await applyPromoCode(promoCode, totalPrice)
    discount = promo.discount
    promoCodeId = promo.promoCodeId
  }

  const {
    totalServiceCost,
    orderServices
  } = getOrderService(totalPrice, selectedServices)

  const finalPrice = totalPrice - discount

  const order = new Order({
    userId,
    items,
    totalPrice: finalPrice,
    totalServiceCost,
    totalDiscounts: discount,
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
