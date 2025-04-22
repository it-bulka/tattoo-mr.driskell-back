const { getUserCart, validateCartItems, applyPromoCode, getPromoCode } = require('../sevices')
const { BadRequest, NotFound } = require("../errors")
const { updateUserCart } = require('../sevices/cart')
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
    extraServices,
    totalItems,
    totalToPay
  } = await getUserCart(userId, req.lang)

  let totalPrice = totalToPay
  let totalDiscount = discount
  const promocodeData = {
    err: undefined,
    promo: undefined
  }

  if (promoCode) {
    try {
      const promo = await getPromoCode(promoCode)

      if(!promo) {
        throw new Error('This promo code is no longer valid.')
      } else {
        const promoCalculation = await applyPromoCode(promo, totalPrice)
        totalDiscount += promoCalculation.discount

        promocodeData.promo = {
          id: promo._id,
          code: promo.code,
          type: promo.discountType,
          value: promo.discountValue
        }
      }
    } catch (err) {
      promocodeData.err = {
        code: promoCode,
        message: err.message,
      }
    }

  }

  const finalPrice = totalPrice - discount

  const resData = {
    items,
    discount: totalDiscount,
    extraServices,
    totalItems,
    totalToPay: finalPrice,
  }

  if(promocodeData.err) {
    resData['promoCodeError'] = promocodeData.err
  } else if(promocodeData.promo) {
    resData['promocode'] = promocodeData.promo
  }

  return res.json({
    data: resData,
    success: true
  })
}

module.exports = {
  getCart,
  updateCart
}