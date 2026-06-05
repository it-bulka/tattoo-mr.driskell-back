const { getUserCart, validateCartItems, applyPromoCode, getPromoCode } = require('../sevices')
const { fractTwoDigit } = require('../utils')
const { BadRequest } = require("../errors")
const { updateUserCart, calculateCart } = require('../sevices/cart')
const { cartPopulate } = require("../../mockPopulate/cart/cart-populate");

const getCart = async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    throw new BadRequest('No user id provided')
  }

  const cart = await getUserCart(userId, req.lang)

  return res.json({ data: cart, success: true })
}

const updateCart = async (req, res) => {
  const { userId, orderItems = [], promoCode } = req.body
  if (!userId) throw new BadRequest('No user id provided')

  const result = await validateCartItems(orderItems)
  if(!result.valid) {
    throw new BadRequest(result.error)
  }

  await updateUserCart(userId, orderItems)

  const {
    items,
    discount,
    bundleDiscount,
    cartDiscount,
    extraServices,
    totalItems,
    totalToPay
  } = await getUserCart(userId, req.lang)

  // totalToPay from getUserCart is already the sum of sale prices (priceCurrent * qty),
  // so `discount` is the visible savings — it must NOT be subtracted again.
  let finalPrice = totalToPay
  let totalDiscount = discount
  const promocodeData = {
    err: undefined,
    promo: undefined,
    promoDiscount: 0
  }

  if (promoCode) {
    try {
      const promo = await getPromoCode(promoCode)

      if(!promo) {
        throw new Error('This promo code is no longer valid.')
      } else {
        const promoCalculation = await applyPromoCode(promo, finalPrice)
        totalDiscount += promoCalculation.discount
        finalPrice -= promoCalculation.discount

        promocodeData.promo = {
          id: promo._id,
          code: promo.code,
          type: promo.discountType,
          value: promo.discountValue
        }
        promocodeData.promoDiscount = promoCalculation.discount
      }
    } catch (err) {
      promocodeData.err = {
        code: promoCode,
        message: err.message,
      }
    }

  }

  const resData = {
    items,
    discount: totalDiscount,
    bundleDiscount,
    cartDiscount,
    extraServices,
    totalItems,
    totalToPay: finalPrice,
  }

  if(promocodeData.err) {
    resData['promoCodeError'] = promocodeData.err
  } else if(promocodeData.promo) {
    resData['promocode'] = promocodeData.promo
    resData['promoDiscount'] = fractTwoDigit(promocodeData.promoDiscount)
  }

  return res.json({
    data: resData,
    success: true
  })
}

const calculateCartController = async (req, res) => {
  const { items = [], lang } = req.body
  if (!items.length) throw new BadRequest('No items provided')

  const result = await calculateCart(items, lang || req.lang)
  res.json({ data: result, success: true })
}

module.exports = {
  getCart,
  updateCart,
  calculateCartController
}