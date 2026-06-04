const { StatusCodes } = require("http-status-codes")
const { createOrder } = require('../sevices')
const { Order } = require("../models");
const { NotFound, BadRequest, Unauthorized } = require("../errors");
const { toOrderDto } = require('../utils')
const { verifyWebhookSignature, generateCallbackResponseSignature } = require('../sevices/wayforpay')


const createUserOrder = async (req, res) => {
  const {
    userId,
    items,
    paymentMethod,
    promoCode,
    deliveryMethod,
    selectedServices,
    buyer,
    shippingAddress,
  } = req.body

  console.log('[createUserOrder] payload:', JSON.stringify({ userId, paymentMethod, deliveryMethod, itemsCount: items?.length, selectedServices }, null, 2))

  try {
    const { order, paymentData } = await createOrder({
      userId,
      items,
      paymentMethod,
      promoCode,
      deliveryMethod,
      selectedServices,
      buyer,
      shippingAddress,
    }, req.lang)

    res.status(StatusCodes.OK).json({
      data: { orderId: order._id, status: order.status, paymentData },
      success: true,
    })
  } catch (err) {
    console.error('[createUserOrder] Failed:', err)
    throw err
  }
}

const wayforpayCallback = async (req, res) => {
  const isValid = verifyWebhookSignature(req.body)
  if (!isValid) {
    throw new BadRequest('Invalid WayForPay signature')
  }

  const { orderReference, transactionStatus, transactionId } = req.body

  const order = await Order.findById(orderReference)
  if (!order) {
    throw new NotFound('Order not found')
  }

  if (transactionStatus === 'Approved') {
    order.status = 'paid'
    if (transactionId) order.wayforpayTransactionId = String(transactionId)
    await order.save()
  } else if (['Declined', 'Expired', 'Voided'].includes(transactionStatus)) {
    order.status = 'cancelled'
    await order.save()
  }

  const time = Math.floor(Date.now() / 1000)
  const responseStatus = 'accept'
  const signature = generateCallbackResponseSignature(orderReference, responseStatus, time)

  res.status(StatusCodes.OK).json({ orderReference, status: responseStatus, time, signature })
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
  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new Unauthorized('Access denied')
  }
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)
  const skip = (page - 1) * limit

  const [orders, totalCount] = await Promise.all([
    Order.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ userId }),
  ])

  const totalPages = Math.ceil(totalCount / limit)

  res.status(StatusCodes.OK).json({
    data: orders.map(toOrderDto),
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
    success: true,
  })
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
  getAllOrders,
  wayforpayCallback,
}