const mongoose = require('mongoose')
const { serviceType } = require('./services')

const OrderItemSchema = new mongoose.Schema({
  tattooMachineId: { type: mongoose.Types.ObjectId, ref: 'TattooMachine', required: true },
  quantity: { type: Number, default: 1, min: 1, required: true },
  nameAtPurchase: { type: String, required: [true, 'Provide name of the tattoo machine at purchase'] },
  priceAtPurchase: { type: Number, required: [true, 'Provide price of the tattoo machine at purchase'] },
  originalPriceAtPurchase: {
    type: Number,
    required: [true, 'Provide original price of the tattoo machine at purchase']
  },
  imageAtPurchase: { type: String, required: [true, 'Provide image of the tattoo machine at purchase'] },
},{ _id: false })

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  orderDate: { type: Date, default: Date.now },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: [true, 'Provide final total price of order'] },
  totalDiscounts: { type: Number, required: [true, 'Provide total discount of order'] },
  totalOriginalProductsPrice: { type: Number, required: [true, 'Provide total price of all products without discounts and other services'] },
  totalServicePrice: { type: Number, default: 0 },
  promoCode: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode', default: null },
  shippingAddress: {
    type: Object
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "paid", "expired"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cashOnDelivery', 'bankTransfer'],
    default: "credit card",
  },
  deliveryMethod: {
    type: String,
    enum: ['novaPoshta', 'courier'],
    required: true
  },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      priceAtPurchase: { type: Number, required: true },
      typeAtPurchase: { type: String, enum: serviceType, required: true },
      calculatedServiceCost: { type: Number, required: true },
    }
  ],
}, { timestamps: true })

OrderSchema.index({ userId: 1, createdAt: 1 }, { unique: true })

OrderSchema.pre('save', function (next) {
  if(this.isNew) next()

  this.updatedAt = new Date()
  next()
})

const Order = new mongoose.model('Order', OrderSchema)

module.exports = {
  Order
}