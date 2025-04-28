const tattooMachine = require("./tattoo-machine.js")
const order = require("./order")
const services = require("./services")
const cart = require("./cart")
const cartValidation = require("./cart-validation")
const promo = require("./promo-codes")
const likes = require("./likes")

module.exports = {
  ...tattooMachine,
  ...order,
  ...services,
  ...cart,
  ...cartValidation,
  ...promo,
  ...likes
}