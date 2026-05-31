require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('../app/db/connectDB')
const { cartPopulate } = require('./cart/cart-populate')

const PORT = 3001

const start = async () => {
  try {
    await connectDB()
    app.listen(PORT)

    await cartPopulate()

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

start()