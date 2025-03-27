const ordersData = require('./orders.json')
const { Order } = require('../../app/models/order')

const populateOrder = async () => {
  await Order.deleteMany({})
  await Order.create(ordersData)
}

module.exports = {
  populateOrder
}