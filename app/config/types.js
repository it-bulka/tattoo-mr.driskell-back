/**
 * @file Contains shared JSDoc typedefs for the project.
 */

const mongoose = require('mongoose')

/**
 * @typedef {import('mongoose').Types.ObjectId} ObjectId
 */

/**
 * @typedef {'uk' | 'en'} Language
 */

/**
 * @typedef {Object} TattooMachine
 * @property {ObjectId} id - The ID of the tattoo machine.
 * @property {string[]} images - List of image URLs.
 * @property {Language} lang - Language of the translation.
 * @property {number} price - Price in Ukrainian currency.
 * @property {string[]} tags - List of tags.
 */

/**
 * @typedef {('percentage'|'fixed')} DiscountType
 */

/**
 * @typedef {('pending'|'shifted'| 'delivered')} OrderStatus
 */

/**
 * @typedef {('post'|'courier')} DeliveryMethod
 */

/**
 * @typedef {("credit card"|"paypal")} PaymentMethod
 */

/**
 * @typedef {Object} Buyer
 * @property {string} name - The name of buyer
 * @property {string} [email] - The email of buyer (optional)
 * @property {string} phone - The phone of buyer
 */

/**
 * @typedef {Object} ShippingAddress
 * @property {string} city - The city of buyer
 * @property {string} street - The street of buyer
 * @property {string} apartment - The apartment of buyer
 * @property {string} [entrance] - The entrance of buyer (optional)
 * @property {string} [floor] - The floor of buyer (optional)
 * @property {string} [doorphone] - The doorphone of buyer (optional)
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} quantity - The quantity of item
 * @property {string} name - The name of item at purchase
 * @property {number} price - The name of item at purchase
 * @property {string} image - The image of item at purchase
 */

/**
 * @typedef {Object} Order
 * @property {OrderItem[]} items - The list of purchased items
 * @property {string} number - The number of order
 * @property {OrderStatus} status - The number of order
 * @property {number} totalCost - The total cost of order
 * @property {string} promocode - The promo code
 * @property {PaymentMethod} paymentMethod - The payment method of order
 * @property {DeliveryMethod} deliveryMethod - The delivery method of order
 * @property {ShippingAddress} shippingAddress - The address for delivery
 * @property {Buyer} user - The data of buyer
 */


module.exports = {}
