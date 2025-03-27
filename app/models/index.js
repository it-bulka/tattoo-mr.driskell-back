const { TattooMachine, TattooMachineTranslation } = require("./tattoo-machine")
const { PromoCode } = require("./promo-codes")
const order = require("./order")
const service = require("./services")

module.exports = {
  TattooMachine, TattooMachineTranslation,
  PromoCode,
  ...order,
  ...service
}