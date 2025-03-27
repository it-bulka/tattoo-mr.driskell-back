const { StatusCodes } = require("http-status-codes")
const { createOrder } = require('../sevices')
const { Order } = require("../models");
const { NotFound } = require("../errors");


const createUserOrder = async (req, res) => {
  const { userId } = req.params

  const {
    items,
    paymentMethod,
    promoCode,
    deliveryMethod,
    selectedServices,
    buyer
  } = req.params

  const order = await createOrder({
    userId,
    items,
    paymentMethod,
    promoCode,
    deliveryMethod,
    selectedServices,
    buyer
  })

  res.status(StatusCodes.OK).json({ data: order, success: true })
}

const getOrderById = async (req, res) => {
  const orderId = req.params.id
  const order = await Order.findById(orderId)

  if (!order) {
    throw new NotFound('Order not found')
  }
  res.status(StatusCodes.OK).json({ data: order, success: true })
}

const getAllOrdersByUser = async (req, res) => {
  const { userId } = req.params
  const orders = await Order.find({ userId: userId })

  if (!orders) {
    throw new NotFound('Orders not found')
  }

  res.status(StatusCodes.OK).json({ data: orders, success: true })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find()

  if (!orders) {
    throw new NotFound('Orders not found')
  }

  res.status(StatusCodes.OK).json({ data: orders, success: true })
}
module.exports = {
  createUserOrder,
  getOrderById,
  getAllOrdersByUser,
  getAllOrders
}