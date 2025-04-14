const { getUserCart } = require('../sevices')
const { BadRequest } = require("../errors")
const { checkExistedTattooMachine, updateUserCart } = require('../sevices/cart')

const getCart = async (req, res) => {
  const { userId } = req.query
  if (!userId) {
    throw new BadRequest('No user id provided')
  }

  const cart = await getUserCart(userId, req.lang)
  return res.json({ data: cart, success: true })
}

const updateCart = async (req, res) => {
  const { userId, orderItems = [] } = req.body

  if (!userId) throw new BadRequest('No user id provided')

  const result = await checkExistedTattooMachine(orderItems)
  if(result.status === 400) {
    throw new BadRequest(result.errors)
  }

  await updateUserCart(userId, orderItems)

  const cart = await getUserCart(userId, req.lang)
  return res.json({ data: cart, success: true })
}

module.exports = {
  getCart,
  updateCart
}