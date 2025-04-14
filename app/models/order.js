const mongoose = require('mongoose')
const { serviceType } = require('./services')

const OrderItemSchema = new mongoose.Schema({
  tattooMachineId: { type: mongoose.Types.ObjectId, ref: 'TattooMachine', required: true },
  quantity: { type: Number, default: 1, min: 1, required: true },
  nameAtPurchase: { type: String, required: [true, 'Provide name of the tattoo machine at purchase'] },
  priceAtPurchase: { type: Number, required: [true, 'Provide price of the tattoo machine at purchase'] },
  imageAtPurchase: { type: String, required: [true, 'Provide image of the tattoo machine at purchase'] },
})

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  orderDate: { type: Date, default: Date.now },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: [true, 'Provide final total price of order'] },
  totalDiscounts: { type: Number, required: [true, 'Provide total discount of order'] },
  totalProductsPrice: { type: Number, required: [true, 'Provide total price of all products without discounts and other services'] },
  totalServicePrice: { type: Number, required: [true, 'Provide total service price of order'] },
  promoCode: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', default: null },
  shippingAddress: {
    type: Object
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["credit card", "paypal"],
    default: "credit card",
  },
  deliveryMethod: {
    type: String,
    enum: ['post', 'courier'],
    required: true
  },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
      priceAtPurchase: { type: Number, required: true },
      typeAtPurchase: { type: String, enum: serviceType, required: true },
      calculatedServiceCost: { type: Number, required: true },
    }
  ],
}, { timestamps: true })

OrderSchema.index({ userId: 1, tattooMachineId: 1, createdAt: 1 }, { unique: true })

OrderSchema.pre('save', function (next) {
  if(this.isNew) next()

  this.updatedAt = new Date()
  next()
})

const Order = new mongoose.model('Order', OrderSchema)

module.exports = {
  Order
}