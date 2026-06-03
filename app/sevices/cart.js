const mongoose = require('mongoose')
const { Cart } = require('../models/cart')
const { setUrl, fractTwoDigit } = require('../utils')
const { getActiveDiscounts, applyDiscountsToProducts, applyCartDiscount } = require('./discount')
const { getActiveBundles, applyBundleDiscountToCart } = require('./bundle')

const getUserCart = async (userId, lang) => {
  const [cartRaw, activeDiscounts, activeBundles] = await Promise.all([
    Cart.aggregate([
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
          originalPrice: '$productData.price',
          manualPrice: '$productData.priceCurrent',
          category: '$productData.category',
          image: { $arrayElemAt: ['$productData.images', 0] },
          title: '$translation.title'
        }
      }
    ]),
    getActiveDiscounts(),
    getActiveBundles()
  ])

  if (!cartRaw) return null

  // Apply per-item discounts
  const productSnapshots = cartRaw.map(item => ({
    id: item.productId.toString(),
    price: item.originalPrice,
    category: item.category,
    priceCurrent: item.manualPrice ?? undefined
  }))
  const discounted = applyDiscountsToProducts(productSnapshots, activeDiscounts)

  let totalItems = 0
  let subtotal = 0
  let discount = 0

  const items = cartRaw.map((item, i) => {
    const effectivePrice = discounted[i].priceCurrent ?? item.originalPrice
    const quantity = item.quantity
    const total = effectivePrice * quantity

    discount += (item.originalPrice - effectivePrice) * quantity
    totalItems += quantity
    subtotal += total

    return {
      title: item.title,
      price: effectivePrice,
      originalPrice: item.originalPrice,
      quantity,
      total,
      image: setUrl(item.image),
      productId: item.productId
    }
  })

  const cartItemIds = items.map(i => i.productId.toString())
  const bundleDiscount = applyBundleDiscountToCart(cartItemIds, activeBundles, items)
  const subtotalAfterBundle = subtotal - bundleDiscount
  const cartDiscount = applyCartDiscount(subtotalAfterBundle, activeDiscounts)

  return {
    items,
    totalItems,
    discount: fractTwoDigit(discount),
    bundleDiscount: fractTwoDigit(bundleDiscount),
    cartDiscount,
    extraServices: 0,
    totalToPay: fractTwoDigit(subtotalAfterBundle - cartDiscount)
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