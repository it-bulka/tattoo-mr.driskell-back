const toOrderDto = ({
  _id, orderDate, status, totalPrice, totalDiscounts,
  paymentMethod, deliveryMethod, buyer, shippingAddress, items,
}) => ({
  _id,
  orderDate,
  status,
  totalPrice,
  totalDiscounts,
  paymentMethod,
  deliveryMethod,
  buyer,
  shippingAddress,
  items: items.map(({ tattooMachineId, quantity, nameAtPurchase, priceAtPurchase, originalPriceAtPurchase, imageAtPurchase }) => ({
    tattooMachineId,
    quantity,
    nameAtPurchase,
    priceAtPurchase,
    originalPriceAtPurchase,
    imageAtPurchase,
  })),
})

module.exports = { toOrderDto }
