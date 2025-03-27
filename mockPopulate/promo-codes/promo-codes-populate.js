const promoCodeData = require('./promo-codes.json')
const { PromoCode } = require('../../app/models/promo-codes')

const populatePromoCode = async () => {
  await PromoCode.deleteMany({})
  await PromoCode.create(promoCodeData)
}

module.exports = {
  populatePromoCode
}