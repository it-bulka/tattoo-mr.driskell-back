const { TattooMachine } = require("../models")

const validateCartItems = async (cartItems) => {
  const productIds = cartItems.map(item => item.id)
  const fetchedExistingProducts = await TattooMachine.find({ _id: { $in: productIds } })

  const existingIds = new Set(fetchedExistingProducts.map(p => p._id.toString()))

  const invalidIds = cartItems
    .filter(item => !existingIds.has(item.id.toString()))
    .map(item => item.id)

  if (invalidIds.length > 0) {
    return {
      valid: false,
      error: 'Some products not found',
      invalidIds,
    }
  }

  return { valid: true, machines: fetchedExistingProducts, productIds }
}

module.exports = {
  validateCartItems
}
