const mongoose = require('mongoose')

const SingleCartItemSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 1  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'TattooMachine',
    required: true
  }
})

const CarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  orderItems: [SingleCartItemSchema],
}, { timestamps: true })

const Cart = mongoose.model('Cart', CarSchema)

module.exports = {
  Cart
}