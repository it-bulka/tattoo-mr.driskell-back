const { TattooMachine, TattooMachineTranslation } = require("./tattoo-machine")
const { Brand } = require("./brands")
const { BrandTranslation } = require("./brand-translation")
const { PromoCode } = require("./promo-codes")
const { PromoCodeTranslation } = require("./promo-code-translation")
const { Discount } = require("./discount")
const { Bundle } = require("./bundle")
const order = require("./order")
const service = require("./services")
const favourite = require("./favourite-machine")
const cart = require("./cart")
const Token = require("./token")

module.exports = {
  TattooMachine, TattooMachineTranslation,
  Brand, BrandTranslation,
  PromoCode, PromoCodeTranslation,
  Discount,
  Bundle,
  ...order,
  ...service,
  ...favourite,
  ...cart,
  Token
}