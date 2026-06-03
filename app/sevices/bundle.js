const { Bundle } = require('../models/bundle')
const { fractTwoDigit } = require('../utils')

const getBundleForProduct = async (productId) => {
  const idStr = productId.toString()
  const bundle = await Bundle.findOne({
    isActive: true,
    productIds: productId
  }).lean()

  if (!bundle) return null

  const comboProductIds = bundle.productIds.filter(id => id.toString() !== idStr)

  return { tiers: bundle.tiers, comboProductIds }
}

const getActiveBundles = () => Bundle.find({ isActive: true }).lean()

const applyBundleDiscountToCart = (cartItemIds, activeBundles, items) => {
  let totalBundleDiscount = 0

  for (const bundle of activeBundles) {
    const bundleIdStrs = bundle.productIds.map(id => id.toString())
    const matchingIds = cartItemIds.filter(id => bundleIdStrs.includes(id))
    if (!matchingIds.length) continue

    const applicable = bundle.tiers.filter(t => t.minItems <= matchingIds.length)
    if (!applicable.length) continue

    const bestTier = applicable.reduce((best, t) => t.value > best.value ? t : best)

    const matchingSubtotal = items
      .filter(item => matchingIds.includes(item.productId.toString()))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)

    const discount = bestTier.isPercentage
      ? fractTwoDigit((matchingSubtotal * bestTier.value) / 100)
      : Math.min(bestTier.value, matchingSubtotal)

    totalBundleDiscount += discount
  }

  return fractTwoDigit(totalBundleDiscount)
}

module.exports = { getBundleForProduct, getActiveBundles, applyBundleDiscountToCart }
