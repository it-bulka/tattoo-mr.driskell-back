const { fractTwoDigit, setUrl } = require("../utils")
const { TattooMachineTranslation, TattooMachine } = require('../models/tattoo-machine')
const { validateCartItems } = require('../sevices/cart-validation')

/** @typedef {import('../config/types').ObjectId} ObjectId */
/** @typedef {import('../config/types').ShippingAddress} ShippingAddress */
/** @typedef {import('../config/types').TattooMachine} TattooMachine */
/** @typedef {import('../config/types').PaymentMethod} PaymentMethod */
/** @typedef {import('../config/types').DeloveryMethod} DeloveryMethod */
/** @typedef {import('../config/types').Buyer} Buyer */

const getTattooMachinesForOrder = async (cartItems, lang, type = 'order') => {

  const { machines, productIds } = await validateCartItems(cartItems)
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

    if(type === 'order') {
      return {
        tattooMachineId: machine._id,
        quantity: item.quantity,
        nameAtPurchase,
        priceAtPurchase,
        originalPriceAtPurchase: machine.price,
        imageAtPurchase: setUrl(machine.images[0])
      }
    } else if (type === 'cart') {

      return {
        productId: machine._id,
        quantity: item.quantity,
        title: nameAtPurchase,
        price: priceAtPurchase,
        originalPrice: machine.price,
        image: setUrl(machine.images[0]),
        total: priceAtPurchase * item.quantity
      }
    }
  })

  return orderItems
}


const orderMachineCalculation = (sum, { priceAtPurchase, originalPriceAtPurchase, quantity }) => {
  const itemOriginalTotalPrice = originalPriceAtPurchase * quantity
  const itemDiscount = (originalPriceAtPurchase - priceAtPurchase) * quantity

  return {
    totalPrice: sum.totalPrice + itemOriginalTotalPrice,
    totalDiscount: sum.totalDiscount + itemDiscount,
  }
}

const cartMachineCalculation = (sum, { price: priceAtPurchase, originalPrice: originalPriceAtPurchase, quantity }) => {
  const itemOriginalTotalPrice = originalPriceAtPurchase * quantity
  const itemDiscount = (originalPriceAtPurchase - priceAtPurchase) * quantity

  return {
    totalPrice: sum.totalPrice + itemOriginalTotalPrice,
    totalDiscount: sum.totalDiscount + itemDiscount,
  }
}

const singleMachineCalculation = (type = 'order') => {
  switch (type) {
    case 'cart':
      return cartMachineCalculation;
    case 'order':
    default:
      return orderMachineCalculation;
  }
}


const calculateProductPrice = async (items, lang, type = 'order') => {
  let totalPrice = 0
  let discount = 0

  const tattooMachines = await getTattooMachinesForOrder(items, lang, type)
  const checkedItems = tattooMachines.reduce(singleMachineCalculation(type), { totalPrice: 0, totalDiscount: 0 })

  totalPrice = fractTwoDigit(checkedItems.totalPrice)
  discount = fractTwoDigit(checkedItems.totalDiscount)

  return {
    tattooMachines,
    totalPrice,
    discount,
  }
}

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
const getOrderServiceCost = async (totalOrderCost, selectedServices = []) => {
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


module.exports = {
  calculateProductPrice,
  getTattooMachinesForOrder,
  getOrderServiceCost
}
