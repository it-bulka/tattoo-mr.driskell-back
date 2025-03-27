const tattooMachine = require("./tattoo-machine.js")
const order = require("./order")
const services = require("./services")

module.exports = {
  ...tattooMachine,
  ...order,
  ...services
}