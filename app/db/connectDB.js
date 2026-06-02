const mongoose = require('mongoose')
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 60000,
  })
}

module.exports = connectDB