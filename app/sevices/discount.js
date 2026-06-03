const { Discount } = require('../models/discount')
const { fractTwoDigit } = require('../utils')

const activeDateFilter = (now) => ({
  $or: [
    { startDate: null, endDate: null },
    { startDate: { $lte: now }, endDate: { $gte: now } },
    { startDate: null, endDate: { $gte: now } },
    { startDate: { $lte: now }, endDate: null }
  ]
})

const getActiveDiscounts = async () => {
  const now = new Date()
  return Discount.find({ isActive: true, ...activeDateFilter(now) }).lean()
}

const calculateDiscountAmount = (price, discount) => {
  if (!discount) return 0
  if (discount.isPercentage) return fractTwoDigit((price * discount.value) / 100)
  return Math.min(discount.value, price)
}

// Returns { base, stackable } — base is the highest-priority non-stackable discount,
// stackable is an array of stackable discounts to add on top.
const resolveProductDiscounts = (productId, category, activeDiscounts) => {
  const idStr = productId.toString()
  const SPECIFICITY = { product: 2, category: 1 }

  const applicable = activeDiscounts.filter(d => {
    if (d.type === 'product') return d.productIds.some(id => id.toString() === idStr)
    if (d.type === 'category') return d.categories.includes(category)
    return false
  })

  if (!applicable.length) return { base: null, stackable: [] }

  applicable.sort((a, b) => {
    const specDiff = (SPECIFICITY[b.type] || 0) - (SPECIFICITY[a.type] || 0)
    return specDiff !== 0 ? specDiff : b.priority - a.priority
  })

  return {
    base: applicable.find(d => !d.stackable) || null,
    stackable: applicable.filter(d => d.stackable)
  }
}

const applyDiscountsToProducts = (machines, activeDiscounts) => {
  if (!activeDiscounts.length) return machines

  return machines.map(machine => {
    const id = machine.id || (machine._id && machine._id.toString())
    const { base, stackable } = resolveProductDiscounts(id, machine.category, activeDiscounts)

    if (!base && !stackable.length) return machine

    let totalDiscount = 0
    if (base) totalDiscount += calculateDiscountAmount(machine.price, base)
    stackable.forEach(d => { totalDiscount += calculateDiscountAmount(machine.price, d) })

    const computedPrice = fractTwoDigit(Math.max(0, machine.price - totalDiscount))

    // Manual priceCurrent wins if it gives a better deal for the customer
    const manualPrice = machine.priceCurrent
    const effectivePrice = manualPrice != null ? Math.min(manualPrice, computedPrice) : computedPrice

    if (effectivePrice >= machine.price) return machine

    return { ...machine, priceCurrent: effectivePrice }
  })
}

const applyCartDiscount = (totalPrice, activeDiscounts) => {
  const cartDiscounts = activeDiscounts.filter(d => d.type === 'cart')
  if (!cartDiscounts.length) return 0

  const nonStackable = cartDiscounts.filter(d => !d.stackable).sort((a, b) => b.priority - a.priority)
  const stackable = cartDiscounts.filter(d => d.stackable)

  let totalDiscount = 0
  if (nonStackable.length) totalDiscount += calculateDiscountAmount(totalPrice, nonStackable[0])
  stackable.forEach(d => { totalDiscount += calculateDiscountAmount(totalPrice, d) })

  return fractTwoDigit(Math.min(totalDiscount, totalPrice))
}

const buildDiscountedProductsFilter = (activeDiscounts) => {
  const productIds = []
  const categories = []

  activeDiscounts.forEach(d => {
    if (d.type === 'product') productIds.push(...d.productIds)
    if (d.type === 'category') categories.push(...d.categories)
  })

  const orConditions = [
    { $expr: { $and: [{ $ne: ['$priceCurrent', null] }, { $lt: ['$priceCurrent', '$price'] }] } }
  ]
  if (productIds.length) orConditions.push({ _id: { $in: productIds } })
  if (categories.length) orConditions.push({ category: { $in: categories } })

  return [{ $match: { $or: orConditions } }]
}

const getBundleTiersForCombo = async (productIds) => {
  if (!productIds.length) return null

  const now = new Date()
  const bundleDiscounts = await Discount.find({
    type: 'bundle',
    isActive: true,
    ...activeDateFilter(now),
    bundleProductIds: { $in: productIds }
  }).lean()

  if (!bundleDiscounts.length) return null

  const sorted = bundleDiscounts.sort((a, b) => b.priority - a.priority)
  return sorted[0].tiers || null
}

module.exports = {
  getActiveDiscounts,
  applyDiscountsToProducts,
  applyCartDiscount,
  getBundleTiersForCombo,
  buildDiscountedProductsFilter
}
