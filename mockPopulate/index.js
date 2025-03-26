require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

const connectDB = require('../app/db/connectDB')
const { populateUsers } = require('./users/users-populate')

const PORT = 3001

const start = async () => {
  try {
    await connectDB()
    app.listen(PORT)

    await populateUsers()

    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
}

start()