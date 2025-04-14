const tattooMachine = require("./tattoo-machine.js")
const order = require("./order")
const services = require("./services")
const cart = require("./cart")

module.exports = {
  ...tattooMachine,
  ...order,
  ...services,
  ...cart
}