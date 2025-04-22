const mongoose = require('mongoose')
const { Cart } = require('../models/cart')
const { setUrl, fractTwoDigit } = require('../utils')

const getUserCart = async (userId, lang) => {
  const cart = await Cart.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'tattoomachines',
        localField: 'orderItems.id',
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
        quantity: '$orderItems.quantity',
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
    discount: fractTwoDigit(discount),
    extraServices: 0,
    totalToPay: fractTwoDigit(subtotal)
  }
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
  updateUserCart
}