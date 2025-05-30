const { TattooMachine, TattooMachineTranslation } = require("./tattoo-machine")
const { PromoCode } = require("./promo-codes")
const order = require("./order")
const service = require("./services")
const favourite = require("./favourite-machine")
const cart = require("./cart")
const Token = require("./token")

module.exports = {
  TattooMachine, TattooMachineTranslation,
  PromoCode,
  ...order,
  ...service,
  ...favourite,
  ...cart,
  Token
}