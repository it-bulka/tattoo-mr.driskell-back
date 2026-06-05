const { promoActivate, updateUserCart, getPromoCodesList } = require('../sevices')

const promoCodeActivate = async (req, res) => {
  const {
    userId,
    promoCode,
    items,
    selectedServices
  } = req.body

  const data = await promoActivate({
    promoCode,
    items,
    selectedServices,
    lang: req.lang,
  })

  await updateUserCart(userId, data.items)

  return res.status(200).json({ data, success: true })
}

const getPromoCodes = async (req, res) => {
  const codes = await getPromoCodesList(req.lang)
  res.status(200).json({ data: codes, success: true })
}

module.exports = {
  promoCodeActivate,
  getPromoCodes
}