const data = require('./cart.json')
const { Cart } = require('../../app/models/cart')

const cartPopulate = async () => {
  await Cart.deleteMany({})
  await Cart.create(data)
}

module.exports = {
  cartPopulate
}