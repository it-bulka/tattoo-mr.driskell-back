const mongoose = require('mongoose')
const { Cart } = require('../models/cart')
const { setUrl } = require('../utils/setUrl')
const { TattooMachine } = require('../models/tattoo-machine')

const getUserCart = async (userId, lang) => {
  const cart = await Cart.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'tattoomachines',
        localField: 'orderItems.product',
        foreignField: '_id',
        as: 'productData'
      }
    },
    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'tattoomachinetranslations',
        let: { productId: '$productData._id', langVar: lang },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$tattooMachineId', '$$productId'] },
                  { $eq: ['$lang', '$$langVar'] }
                ]
              }
            }
          },
          { $project: { title: 1 } }
        ],
        as: 'translation'
      }
    },
    {
      $unwind: {
        path: '$translation',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        productId: '$productData._id',
        quantity: '$orderItems.amount',
        price: {
          $ifNull: ['$productData.priceCurrent', '$productData.price']
        },
        originalPrice: '$productData.price',
        image: { $arrayElemAt: ['$productData.images', 0] },
        title: '$translation.title'
      }
    }
  ])

  if (!cart) return null

  let totalItems = 0
  let subtotal = 0
  let discount = 0

  const items = cart.map(item => {
    const priceCurrent = item.price
    const price = priceCurrent ?? item.originalPrice
    const quantity = item.quantity
    const total = price * quantity
    discount += (item.originalPrice - Number(priceCurrent)) * quantity

    totalItems += quantity
    subtotal += total

    return {
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      quantity: item.quantity,
      total,
      image: setUrl(item.image),
      productId: item.productId
    }
  })

  return {
    items,
    totalItems,
    discount,
    extraServices: 0,
    totalToPay: subtotal
  }
}

const checkExistedTattooMachine = async (orderItems) => {
  const productIds = orderItems.map(item => item.product)

  const existingProducts = await TattooMachine.find({ _id: { $in: productIds } })
  const existingIds = new Set(existingProducts.map(p => p._id.toString()))

  const validItems = orderItems.filter(item =>
    existingIds.has(item.product.toString())
  )

  if (validItems.length !== orderItems.length) {
    return {
      status: 400,
      error: 'Some products not found',
      invalidIds: orderItems
        .filter(item => !existingIds.has(item.product.toString()))
        .map(item => item.product)
    }
  }

  return { status: 200, invalidIds: [] }
}

const updateUserCart = async (userId, orderItems) => {
  await Cart.updateOne(
    { userId },
  { $set: { orderItems } },
  { upsert: true }
  )
}

module.exports = {
  getUserCart,
  checkExistedTattooMachine,
  updateUserCart
}